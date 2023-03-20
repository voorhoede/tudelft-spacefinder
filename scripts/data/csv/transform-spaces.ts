import slugify from "slugify";
import { SpaceFeatures } from "./../../../src/types/Filters";
import { CsvSpaceData } from "./../../../src/types/Space";

const facilityProperties = [
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
] as const;

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
] as const;

function getSpaceSlug(spaceId: string, name: string) {
  return [spaceId, name]
    .map((part) => slugify(part.replace(/\./g, "-")).toLowerCase())
    .join("--");
}

export function getSpaceI18n(spaceId: string, sourceName: string) {
  const name = sourceName.trim();
  return {
    name,
    slug: getSpaceSlug(spaceId, name),
  };
}

export function getSpace(
  buildingNumber: number,
  source: Record<string, any>
): CsvSpaceData {
  const facilities: Partial<SpaceFeatures> = {};
  for (const prop of facilityProperties) facilities[prop] = source[prop];
  const space: Partial<CsvSpaceData> = {
    buildingNumber,
    i18n: {
      nl: getSpaceI18n(source.spaceId, source.spaceNameNL),
      en: getSpaceI18n(source.spaceId, source.spaceNameEN),
    },
    facilities: facilities as SpaceFeatures,
  };
  for (const prop of spaceRootProperties) space[prop] = source[prop];
  return space as CsvSpaceData;
}
