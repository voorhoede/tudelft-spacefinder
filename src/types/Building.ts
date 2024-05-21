import { Bounds } from "./Bounds";
import type { Occupancy } from "./Filters";

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
  openingHoursPerDay?: {
    [key: string]: {
      start: string;
      end: string;
    };
  };
}

export type CsvAndCmsBuildingData = Omit<
  BuildingI18n,
  "activeDevices" | "occupancy"
> & { exchangeBuildingId: string };

export type CmsBuildingData = Pick<
  BuildingI18n,
  "number" | "occupancyLimit" | "bounds" | "image"
>;

export type CsvBuildingData = Omit<
  CsvAndCmsBuildingData,
  "occupancyLimit" | "bounds" | "image"
>;
