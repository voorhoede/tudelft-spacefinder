export interface Filters extends Facilities {
  buildings: number[];
  studyType: StudyType[];
  quietness: Quietness[];
  buildingOccupancy: Occupancy[];
  showOpenLocations: boolean;
}

export interface Facilities {
  adjustableChairs: boolean;
  daylit: boolean;
  powerOutlets: boolean;
  ethernet: boolean;
  stationaryPC: boolean;
  whiteBoard: boolean;
  smartBoard: boolean;
  presentationScreen: boolean;
  nearCoffeeMachine: boolean;
  nearPrinter: boolean;
  nearBathroom: boolean;
}

export type SpaceFeatures = Facilities & {
  studyType: StudyType;
  quietness: Quietness;
};

export type StudyType = "group" | "self";
export type Quietness = "silent" | "quiet" | "noisy";

export const OCCUPANCY_RATES = ["quiet", "busy", "crowded"] as const;
export type Occupancy = typeof OCCUPANCY_RATES[number];
