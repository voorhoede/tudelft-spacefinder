import slugify from "slugify";

import { buildingNumberFromId } from "./lib/building-meta.mjs";

const facilities = [
  "adjustableChairs",
  "studyType",
  "quietness",
  "daylit",
  "powerOutlets",
  "ethernet",
  "stationaryPC",
  "whiteBoard",
  "smartBoard",
  "presentationScreen",
  "nearCoffeeMachine",
  "nearPrinter",
  "nearBathroom",
];

const spaceRootProperties = [
  "spaceId",
  "floor",
  "seats",
  "tables",
  "exchangeBuildingId",
  "exchangeRoomId",
  "latitude",
  "longitude",
  "roomId",
];

function getSpaceSlug(spaceId, name) {
  return [spaceId, name]
    .map((part) => slugify(part.replace(/\./g, "-")).toLowerCase())
    .join("--");
}

export function getSpaceI18n(spaceId, sourceName) {
  const name = sourceName.trim();
  return {
    name,
    slug: getSpaceSlug(spaceId, name),
  };
}

export function getSpaces(csvData) {
  return csvData.map((source) => {
    const buildingNumber = buildingNumberFromId(source.buildingId);
    const space = {
      buildingNumber,
      i18n: {
        nl: getSpaceI18n(source.spaceId, source.spaceNameNL), //TODO
        en: getSpaceI18n(source.spaceId, source.spaceNameNL),
      },
      facilities: {},
    };
    for (const prop of spaceRootProperties) space[prop] = source[prop];
    for (const prop of facilities) space.facilities[prop] = source[prop];
    return space;
  });
}
