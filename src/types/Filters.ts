export interface Filters extends Facilities {
  buildings: number[];
  quietness: Quietness[];
  buildingOccupancy: Occupancy[];
  showOpenLocations: boolean;
}

export const FACILITIES = [
  "adjustableChairs",
  "daylit",
  "powerOutlets",
  "stationaryPC",
  "whiteBoard",
  "presentationScreen",
  "nearCoffeeMachine",
  "nearPrinter",
  "nearBathroom",
] as const;

export type Facilities = {
  [P in typeof FACILITIES[number]]: boolean;
};

export type SpaceFeatures = Facilities & {
  studyType: StudyType;
  quietness: Quietness;
};

export type StudyType = "self";
export type Quietness = "silent" | "quiet" | "noisy";

export const OCCUPANCY_RATES = ["quiet", "busy", "crowded", "unknown"] as const;
export type Occupancy = typeof OCCUPANCY_RATES[number];
