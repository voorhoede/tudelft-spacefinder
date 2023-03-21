import slugify from "slugify";
import { CsvRoomData } from "./../../../src/types/Room";

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

export function getRoom(
  buildingNumber: number,
  source: Record<string, any>
): CsvRoomData {
  return {
    buildingNumber,
    floor: source.floor,

    exchangeBuildingId: source.exchangeBuildingId,
    exchangeRoomId: source.exchangeRoomId,
    roomId: source.roomId,
    realEstateNumber: source.realEstateNumber,
    i18n: {
      nl: { name: source.spaceNameNL.trim() },
      en: { name: source.spaceNameEN.trim() },
    },
    facilities: {
      adjustableChairs: false,
      daylit: false,
      powerOutlets: false,
      ethernet: false,
      stationaryPC: false,
      whiteBoard: false,
      smartBoard: false,
      presentationScreen: false,
      nearCoffeeMachine: false,
      nearPrinter: false,
      nearBathroom: false,
      quietness: source.quietness,
      studyType: source.studyType,
    },
    seats: 0,
    tables: 0,
    spaces: 0,
    latitude: 0,
    longitude: 0,
  };
}
