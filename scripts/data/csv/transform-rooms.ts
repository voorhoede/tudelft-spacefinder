import slugify from "slugify";
import { CsvRoomData } from "./../../../src/types/Space";

export function getRoomSlug(realEstateNumber: string) {
  return slugify(realEstateNumber.replace(/\./g, "-")).toLowerCase();
}

export function getRoom(
  buildingNumber: number,
  source: Record<string, any>
): CsvRoomData {
  return {
    buildingNumber,
    floor: source.floor,
    slug: getRoomSlug(source.realEstateNumber),
    exchangeBuildingId: source.exchangeBuildingId,
    exchangeRoomId: source.exchangeRoomId,
    roomId: source.roomId,
    realEstateNumber: source.realEstateNumber,
    i18n: {
      nl: { name: source.spaceNameNL.trim() },
      en: { name: source.spaceNameNL.trim() },
    },
    facilities: {
      adjustableChairs: false,
      daylit: false,
      powerOutlets: false,
      whiteBoard: false,
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
