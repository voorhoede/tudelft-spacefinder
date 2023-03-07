import { Bounds } from "./Bounds";
import type { OpeningHours } from "./OpeningHours";

export interface Building extends BuildingI18n {
  slug: string;
  name: string;
  abbreviation: string;
}

export interface BuildingI18n {
  buildingId: string;
  number: number;
  bounds: Bounds;
  image: {
    url: string;
  };
  i18n: Record<string, { name: string; slug: string; abbreviation: string }>;
  totalSeats: number;
  totalSpaces: number;
  openingHours: OpeningHours[];

  activeDevices?: number;
}
