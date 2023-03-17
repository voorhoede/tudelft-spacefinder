import { buildingNumberFromId } from "./lib/building-meta.mjs";
import slugify from "slugify";

export function getBuildingI18n(number, sourceName, sourceAbbreviation) {
  const abbreviation = sourceAbbreviation.trim();
  return {
    abbreviation,
    name: getBuildingName(sourceName),
    slug: getBuildingSlug(number, abbreviation),
  };
}

function getBuildingSlug(number, abbreviation) {
  return slugify([number, abbreviation].join("-")).toLowerCase();
}

function getBuildingName(sourceName) {
  const dashPos = sourceName.indexOf("-");
  return (dashPos >= 0 ? sourceName.substring(dashPos + 1) : sourceName).trim();
}

export function getBuildings(csvData, cmsData) {
  const buildings = {};
  for (const space of csvData) {
    const number = buildingNumberFromId(space.buildingId);
    if (!(number.toString() in buildings))
      buildings[number.toString()] = {
        buildingId: space.buildingId,
        number: number,
        exchangeBuildingId: space.exchangeBuildingId,
        i18n: {
          nl: getBuildingI18n(
            number,
            space.buildingNameNL,
            space.buildingAbbreviationNL
          ),
          en: getBuildingI18n(
            number,
            space.buildingNameEN,
            space.buildingAbbreviationEN
          ),
        },
        totalSeats: 0,
        totalSpaces: 0,
      };
    buildings[number.toString()].totalSeats += space.seats;
    buildings[number.toString()].totalSpaces += 1;
  }
  for (const cmsBuilding of cmsData) {
    const building = buildings[cmsBuilding.number.toString()];
    if (!building) continue;
    building.bounds = cmsBuilding.bounds;
    building.image = cmsBuilding.image;
  }
  return Object.values(buildings);
}
