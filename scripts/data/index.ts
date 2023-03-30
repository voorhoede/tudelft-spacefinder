import * as dotenv from "dotenv";
dotenv.config();
import fs from "node:fs/promises";
import { getData as getDataFromCsv, transform } from "./csv/index";
import {
  getBuildingsDataFromCms,
  getPageFromCms,
  convertCmsInfo,
} from "./cms/index";
import addOpeningHours from "./exchange/index";
import {
  validateBuildings,
  validateRooms,
  validateSpaces,
} from "./validate/index";

const { CSV_PATH: csvPath } = process.env;
if (!csvPath) {
  throw "CSV_PATH missing in env";
}

function writeFile(path: string, contents: any) {
  const stringifiedData = JSON.stringify(contents, null, 2);

  return fs.writeFile(`./src/data/${path}.json`, stringifiedData);
}

function prepareSpaces(csvPath: string) {
  return Promise.all([getDataFromCsv(csvPath), getBuildingsDataFromCms()])
    .then(([csvData, cmsBuildings]) => {
      const { spaces, rooms, buildings } = transform(csvData, cmsBuildings);
      return addOpeningHours({ spaces, rooms, buildings });
    })
    .then(({ spaces, rooms, buildings }) => {
      const validatedBuildings = validateBuildings(buildings);
      const validatedRooms = validateRooms(rooms);
      const validatedSpaces = validateSpaces(spaces);
      Promise.all([
        writeFile("spaces", validatedSpaces),
        writeFile("rooms", validatedRooms),
        writeFile("buildings", validatedBuildings),
      ]);
    });
}

function preparePage(name: string) {
  return getPageFromCms(name).then((page) =>
    writeFile(name.toLowerCase(), convertCmsInfo(page))
  );
}

Promise.all([
  prepareSpaces(csvPath),
  ...["infoPage", "feedbackPage", "onboarding"].map(preparePage),
])
  .then(() => console.info("Wrote data for spaces, buildings and CMS"))
  .catch(({ message }) =>
    console.error(`An error occurred writing data: ${message}`)
  );
