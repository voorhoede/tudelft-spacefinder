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
  bounds: Bounds;
  image: {
    url: string;
  };
  i18n: Record<string, { name: string; slug: string; abbreviation: string }>;
  totalSeats: number;
  totalSpaces: number;
  openingHours: OpeningHours[];

  activeDevices?: number;
  occupancy?: Occupancy;
}

export type CsvAndCmsBuildingData = Omit<
  BuildingI18n,
  "openingHours" | "activeDevices" | "occupancy"
> & { exchangeBuildingId: string };

export type CsvBuildingData = Omit<CsvAndCmsBuildingData, "bounds" | "image">;

export type CmsBuildingData = Pick<BuildingI18n, "number" | "bounds" | "image">;
