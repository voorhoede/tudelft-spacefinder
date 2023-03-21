import type { SpaceFeatures } from "./Filters";
import type { OpeningHours } from "./OpeningHours";
import type { Building } from "./Building";

export interface Room extends RoomI18n {
  name: string;
  slug: string;
  building: Building;
}

export interface RoomI18n {
  floor: string;
  seats: number;
  tables: number;
  spaces: number;
  latitude: number;
  longitude: number;
  roomId: string;
  realEstateNumber: string;
  facilities: SpaceFeatures;
  buildingNumber: number;
  i18n: Record<string, { name: string }>;
  openingHours: OpeningHours[];
  imageUrl?: string | undefined; //TODO: not there
  activeDevices?: number;
}

export type CsvRoomData = Omit<
  RoomI18n,
  "openingHours" | "imageUrl" | "activeDevices"
> & {
  exchangeBuildingId: string;
  exchangeRoomId: string;
};
