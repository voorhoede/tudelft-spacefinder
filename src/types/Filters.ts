export interface Filters extends Facilities {
  buildings: [];
  studyType: StudyType[];
  quietness: Quietness[];
  showNearbyLocations: boolean;
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
