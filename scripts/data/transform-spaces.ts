import slugify from "slugify";
import { CsvSpaceData } from "./../../../src/types/Space";

export function getSpaceSlug(spaceId: string, name: string) {
  return [spaceId, name]
    .map((part) => slugify(part.replace(/\./g, "-")).toLowerCase())
    .join("--");
}

export function getSpace(source: Record<string, any>): CsvSpaceData {
  return source.spaces.map((space) => ({
    buildingNumber: source.number,
    i18n: {
      en: { name: space.nameEN },
      nl: { name: space.nameNL },
    },
    slug: getSpaceSlug(space.spaceId, space.nameEN.trim()),
    facilities: {
      adjustableChairs: space.adjustableChairs,
      quietness: space.quietness,
      daylit: space.daylit,
      powerOutlets: space.powerOutlets,
      whiteBoard: space.whiteBoard,
      presentationScreen: space.presentationScreen,
      nearCoffeeMachine: space.nearCoffeeMachine,
      nearPrinter: space.nearPrinter,
      nearBathroom: space.nearBathroom,
      grouptables: space.grouptables,
    },
    spaceId: space.spaceId,
    floor: space.floor,
    seats: space.seats,
    exchangeBuildingId: `Building-${source.number}@tudelft.nl`,
    latitude: space.location.latitude,
    longitude: space.location.longitude,
    roomId: space.roomId,
    realEstateNumber: space.spaceId,
    image: space.image,
  }));
}
