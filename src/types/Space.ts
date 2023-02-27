import { Facilities, SpaceFeatures } from "./Filters";
import { OpeningHours } from "./OpeningHours";

export interface Space extends SpaceI18n {
  name: string;
  slug: string;
  building: any;
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
  locationIsOpen?: boolean; //TODO: not there
}
