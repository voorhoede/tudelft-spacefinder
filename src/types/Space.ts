import type { SpaceFeatures, Occupancy } from "./Filters";
import type { Building } from "./Building";

export type Space = Room | RoomZone;

export interface Room extends RoomI18n {
  name: string;
  building: Building;
}

export interface RoomI18n extends RoomBaseRaw {
  spaces: number;
}

export type CsvRoomData = Omit<
  RoomI18n,
  "imageUrl" | "activeDevices"
> & {
  exchangeBuildingId: string;
  exchangeRoomId: string;
};

export interface RoomZone extends SpaceI18n {
  name: string;
  building: Building;
}

export interface SpaceI18n extends RoomBaseRaw {
  spaceId: string;
}

export interface RoomBaseRaw {
  buildingNumber: number;
  floor: string;
  roomId: string;
  realEstateNumber: string;
  slug: string;
  i18n: Record<string, { name: string }>;
  latitude: number;
  longitude: number;
  seats: number;
  tables: number;
  facilities: SpaceFeatures;
  image?: {
    url: string;
  };
  activeDevices?: number;
  occupancy?: Occupancy | undefined;
}

export type CsvSpaceData = Omit<
  SpaceI18n,
  "activeDevices"
> & {
  exchangeBuildingId: string;
  exchangeRoomId: string;
  message?: {
    en: string;
    nl: string;
  };
};

export type CmsSpaceData = Pick<
  SpaceI18n,
  "spaceId" | "image"
> & {
  _allMessageLocales: {
    locale: string;
    value: string;
  }[];
};
