import slugify from "slugify";
import { CsvBuildingData } from "./../../../src/types/Building";

export function getBuildingI18n(
  number: number,
  sourceName: string,
  sourceAbbreviation: string
) {
  const abbreviation = sourceAbbreviation.trim();
  return {
    abbreviation,
    name: getBuildingName(sourceName),
    slug: getBuildingSlug(number, abbreviation),
  };
}

function getBuildingSlug(number: number, abbreviation: string) {
  return slugify([number, abbreviation].join("-")).toLowerCase();
}

function getBuildingName(sourceName: string) {
  const dashPos = sourceName.indexOf("-");
  return (dashPos >= 0 ? sourceName.substring(dashPos + 1) : sourceName).trim();
}

export function getBuilding(
  number: number,
  source: Record<string, any>
): CsvBuildingData {
  return {
    buildingId: source.buildingId,
    number: number,
    exchangeBuildingId: source.exchangeBuildingId,
    i18n: {
      nl: getBuildingI18n(
        number,
        source.buildingNameNL,
        source.buildingAbbreviationNL
      ),
      en: getBuildingI18n(
        number,
        source.buildingNameEN,
        source.buildingAbbreviationEN
      ),
    },
    totalSeats: 0,
    totalSpaces: 0,
  };
}
