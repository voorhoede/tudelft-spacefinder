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

export function getBuilding(source: Record<string, any>): CsvBuildingData {
  return {
    buildingId: `${source.number} - ${source.nameEN}`,
    number: source.number,
    exchangeBuildingId: `Building-${source.number}@tudelft.nl`,
    i18n: {
      nl: getBuildingI18n(
        source.number,
        source.nameNL,
        source.abbreviationNL
      ),
      en: getBuildingI18n(
        source.number,
        source.nameEN,
        source.abbreviationEN
      ),
    },
    totalSeats: source.spaces.reduce((totalSeats, space) => totalSeats + space.seats, 0),
    totalSpaces: source.spaces.length,
    totalRooms: 0,
    occupancyLimit: source.occupancyLimit,
    bounds: source.bounds,
    image: source.image,
  };
}
