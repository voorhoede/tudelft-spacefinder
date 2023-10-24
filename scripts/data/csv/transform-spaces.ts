import slugify from "slugify";
import { SpaceFeatures } from "./../../../src/types/Filters";
import { CsvSpaceData } from "./../../../src/types/Space";

const facilityProperties = [
  "adjustableChairs",
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
    },
    spaceId: space.spaceId,
    floor: space.floor,
    seats: space.seats,
    exchangeBuildingId: `Building-${source.number}@tudelft.nl`,
    exchangeRoomId: '',
    latitude: space.location.latitude,
    longitude: space.location.longitude,
    roomId: space.roomId,
    realEstateNumber: space.spaceId,
    image: space.image,
    message: {
      en: '',
      nl: '',
    },
  }));
}
