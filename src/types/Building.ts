import { Bounds } from "./Bounds";
import type { Occupancy } from "./Filters";
import type { OpeningHours } from "./OpeningHours";

export interface Building extends BuildingI18n {
  slug: string;
  name: string;
  abbreviation: string;
}

export interface BuildingI18n {
  buildingId: string;
  number: number;
  occupancyLimit: number | null;
  bounds: Bounds;
  image: {
    url: string;
  };
  i18n: Record<string, { name: string; slug: string; abbreviation: string }>;
  totalSeats: number;
  totalSpaces: number;
  totalRooms: number;
  activeDevices?: number;

  // Client-side loading
  occupancy?: Occupancy | undefined;
  openingHours?: OpeningHours[];
}

export type CsvAndCmsBuildingData = Omit<
  BuildingI18n,
  "openingHours" | "activeDevices" | "occupancy"
> & { exchangeBuildingId: string };

export type CmsBuildingData = Pick<
  BuildingI18n,
  "number" | "occupancyLimit" | "bounds" | "image"
>;

export type CsvBuildingData = Omit<
  CsvAndCmsBuildingData,
  "occupancyLimit" | "bounds" | "image"
>;
