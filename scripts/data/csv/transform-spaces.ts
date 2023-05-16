import slugify from "slugify";
import { SpaceFeatures } from "./../../../src/types/Filters";
import { CsvSpaceData } from "./../../../src/types/Space";

const facilityProperties = [
  "adjustableChairs",
  "studyType",
  "quietness",
  "daylit",
  "powerOutlets",
  "whiteBoard",
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
  "realEstateNumber",
] as const;

export function getSpaceSlug(spaceId: string, name: string) {
  return [spaceId, name]
    .map((part) => slugify(part.replace(/\./g, "-")).toLowerCase())
    .join("--");
}

export function getSpaceI18n(spaceId: string, sourceName: string) {
  const name = sourceName.trim();
  return {
    name,
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
      nl: { name: source.spaceNameNL.trim() },
      en: { name: source.spaceNameNL.trim() },
    },
    slug: getSpaceSlug(source.spaceId, source.spaceNameNL.trim()),
    facilities: facilities as SpaceFeatures,
  };
  for (const prop of spaceRootProperties) space[prop] = source[prop];
  return space as CsvSpaceData;
}
