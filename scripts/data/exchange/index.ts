// const getRoomAvailability = require('./room-availability')
// const getEmails = require('./get-unique-emails')
// const mapRoomsToTimes = require('./rooms-to-times')
// const openingHours = require('./opening-hours')
import type { CsvSpaceData, SpaceI18n } from "./../../../src/types/Space";
import type {
  CsvAndCmsBuildingData,
  BuildingI18n,
} from "./../../../src/types/Building";

const placeholderOpeningHours = [
  {
    day: "th",
    time: [
      ["2020-10-29T06:00:00Z", "2020-10-29T17:00:00Z"] as [string, string],
    ],
  },
  {
    day: "fr",
    time: [
      ["2020-10-30T06:00:00Z", "2020-10-30T17:00:00Z"] as [string, string],
    ],
  },
  {
    day: "sa",
    time: [],
  },
  {
    day: "su",
    time: [],
  },
  {
    day: "mo",
    time: [
      ["2020-11-02T06:00:00Z", "2020-11-02T17:00:00Z"] as [string, string],
    ],
  },
  {
    day: "tu",
    time: [
      ["2020-11-03T06:00:00Z", "2020-11-03T17:00:00Z"] as [string, string],
    ],
  },
  {
    day: "we",
    time: [
      ["2020-11-04T06:00:00Z", "2020-11-04T17:00:00Z"] as [string, string],
    ],
  },
];

export default ({
  spaces,
  buildings,
}: {
  spaces: CsvSpaceData[];
  buildings: CsvAndCmsBuildingData[];
}): { spaces: SpaceI18n[]; buildings: BuildingI18n[] } => {
  return {
    buildings: buildings.map((building) => {
      const { exchangeBuildingId, ...otherBuildingProps } = building;
      return { ...otherBuildingProps, openingHours: placeholderOpeningHours };
    }),
    spaces: spaces.map((room) => {
      const { exchangeBuildingId, exchangeRoomId, ...otherRoomProps } = room;
      return { ...otherRoomProps, openingHours: placeholderOpeningHours };
    }),
  };
};
