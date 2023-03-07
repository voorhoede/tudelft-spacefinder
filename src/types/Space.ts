import type { SpaceFeatures } from "./Filters";
import type { OpeningHours } from "./OpeningHours";
import type { Building } from "./Building";

export interface Space extends SpaceI18n {
  name: string;
  slug: string;
  building: Building;
}

export interface SpaceI18n {
  spaceId: string;
  floor: string;
  seats: number;
  tables: number;
  latitude: number;
  longitude: number;
  i18n: Record<string, { name: string; slug: string }>;
  roomId: string;
  facilities: SpaceFeatures;
  buildingNumber: number;
  openingHours: OpeningHours[];
  imageUrl?: string | undefined; //TODO: not there

  activeDevices?: number;
}
