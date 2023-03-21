import slugify from "slugify";
import { CsvRoomData } from "./../../../src/types/Space";

export function getRoomSlug(roomId: string) {
  return slugify(roomId.replace(/\./g, "-")).toLowerCase();
}

export function getRoom(
  buildingNumber: number,
  source: Record<string, any>
): CsvRoomData {
  return {
    buildingNumber,
    floor: source.floor,
    slug: getRoomSlug(source.roomId),
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
