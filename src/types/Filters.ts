export interface Filters extends Facilities {
  buildings: number[];
  quietness: Quietness[];
  buildingOccupancy: Occupancy[];
  showOpenLocations: boolean;
}

export const BOOLEAN_FACILITIES = [
  "adjustableChairs",
  "daylit",
  "powerOutlets",
  "whiteBoard",
  "presentationScreen",
  "nearCoffeeMachine",
  "nearPrinter",
  "nearBathroom",
  "grouptables",
] as const;

export const FACILITIES = BOOLEAN_FACILITIES

export type Facilities = {
  [P in typeof BOOLEAN_FACILITIES[number]]: boolean;
};

export type SpaceFeatures = Facilities & {
  quietness: Quietness;
};

export type Quietness = "silent" | "quiet" | "noisy";

export const OCCUPANCY_RATES = ["quiet", "busy", "crowded", "unknown"] as const;
export type Occupancy = typeof OCCUPANCY_RATES[number];
