import type { SpaceFeatures, Occupancy } from "./Filters";
import type { OpeningHours } from "./OpeningHours";
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
  "openingHours" | "imageUrl" | "activeDevices"
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
  openingHours: OpeningHours[];
  imageUrl?: string | undefined; //It is currently not provided by any source, but some frontend code is ready to consume it
  activeDevices?: number;
  occupancy?: Occupancy;
}

export type CsvSpaceData = Omit<
  SpaceI18n,
  "openingHours" | "imageUrl" | "activeDevices"
> & { exchangeBuildingId: string; exchangeRoomId: string };
