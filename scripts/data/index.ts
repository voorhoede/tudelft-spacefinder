import * as dotenv from "dotenv";
dotenv.config();
import fs from "node:fs/promises";
import lunr from "lunr";
import { getData as getDataFromCsv, transform } from "./csv/index";
import {
  getBuildingsDataFromCms,
  getPageFromCms,
  getSpacesDataFromCms,
  convertCmsInfo,
} from "./cms/index";
import addOpeningHours from "./exchange/index";
import {
  validateBuildings,
  validateRooms,
  validateSpaces,
} from "./validate/index";
import { BuildingI18n } from "./../../src/types/Building";

const csvPath = './src/data/studieplekken.csv';

function writeFile(path: string, contents: any) {
  const stringifiedData = JSON.stringify(contents, null, 2);

  return fs.writeFile(`./src/data/${path}.json`, stringifiedData);
}

function prepareSpaces(csvPath: string) {
  return Promise.all([getDataFromCsv(csvPath), getBuildingsDataFromCms(), getSpacesDataFromCms()])
    .then(([csvData, cmsBuildings, cmsSpaces]) => {
      const { spaces, rooms, buildings } = transform(csvData, cmsBuildings, cmsSpaces);
      return addOpeningHours({ spaces, rooms, buildings });
    })
    .then(({ spaces, rooms, buildings }) => {
      const validatedBuildings = validateBuildings(buildings);
      const validatedRooms = validateRooms(rooms);
      const validatedSpaces = validateSpaces(spaces);

      const buildingIndex = prepareBuildingIndex(validatedBuildings);

      Promise.all([
        writeFile("spaces", validatedSpaces),
        writeFile("rooms", validatedRooms),
        writeFile("buildings", validatedBuildings),
        writeFile("building-index", buildingIndex),
      ]);
    });
}

function preparePage(name: string) {
  return getPageFromCms(name).then((page) =>
    writeFile(name.toLowerCase(), convertCmsInfo(page))
  );
}

function prepareBuildingIndex(buildings: BuildingI18n[]) {
  const index = lunr((config) => {
    config.ref('buildingId')

    const buildingLocales = Object.keys(buildings[0].i18n)

    // specify which fields should be indexed
    buildingLocales.forEach((locale) => {
      config.field(`i18n_${locale}_name`)
      config.field(`i18n_${locale}_abbreviation`)
      config.field(`i18n_${locale}_slug`)
    })

    // create a mapping so you can easily retrieve the relevant fields (necessary because lunr cannot access nested fields)
    const buildingMappings = buildings.map((building) => {
      const i18nBuildingNames = buildingLocales.reduce((acc, locale) => ({
          ...acc,
          [`i18n_${locale}_name`]: building.i18n[locale].name,
          [`i18n_${locale}_abbreviation`]: building.i18n[locale].abbreviation,
          [`i18n_${locale}_slug`]: building.i18n[locale].slug,
      }), {})

      return {
        buildingId: building.buildingId,
        ...i18nBuildingNames,
      }
    })

    // index the specified fields of the buildings
    buildingMappings.forEach((buildingMap) => {
      config.add(buildingMap)
    })
  });

  return index;
}

Promise.all([
  prepareSpaces(csvPath),
  ...["infoPage", "feedbackPage"].map(preparePage),
])
  .then(() => console.info("Wrote data for spaces, buildings and CMS"))
  .catch(({ message }) =>
    console.error(`An error occurred writing data: ${message}`)
  );
