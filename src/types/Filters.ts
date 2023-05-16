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
  "whiteBoard",
  "presentationScreen",
  "nearCoffeeMachine",
  "nearPrinter",
  "nearBathroom",
  "numberOfSeats",
] as const;

export type Facilities = {
  "adjustableChairs": boolean,
  "daylit": boolean,
  "powerOutlets": boolean,
  "whiteBoard": boolean,
  "presentationScreen": boolean,
  "nearCoffeeMachine": boolean,
  "nearPrinter": boolean,
  "nearBathroom": boolean,
  "numberOfSeats": number,
};

export type SpaceFeatures = Facilities & {
  quietness: Quietness;
};

export type Quietness = "silent" | "quiet" | "noisy";

export const OCCUPANCY_RATES = ["quiet", "busy", "crowded", "unknown"] as const;
export type Occupancy = typeof OCCUPANCY_RATES[number];
