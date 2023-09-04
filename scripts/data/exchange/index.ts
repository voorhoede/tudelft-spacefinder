import getRoomAvailability from './room-availability'
import getEmails from './get-unique-emails'
import { buildingOpeningHours } from './opening-hours';
import mapRoomsToTimes from './rooms-to-times'

import type {
  CsvSpaceData,
  SpaceI18n,
  CsvRoomData,
  RoomI18n,
} from "./../../../src/types/Space";
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

export default async ({
  spaces,
  rooms,
  buildings,
}: {
  spaces: CsvSpaceData[];
  rooms: CsvRoomData[];
  buildings: CsvAndCmsBuildingData[];
}): { spaces: SpaceI18n[]; rooms: RoomI18n[]; buildings: BuildingI18n[] } => {
  const emails = getEmails(spaces)
  const availability = await getRoomAvailability(emails)
  const roomsToTimesMap = mapRoomsToTimes(emails, availability)
  const openingHours = buildingOpeningHours(roomsToTimesMap, buildings)

  return {
    buildings: openingHours,
    rooms: rooms.map((room) => {
      const { exchangeBuildingId, exchangeRoomId, ...otherRoomProps } = room;
      return { ...otherRoomProps, openingHours: placeholderOpeningHours };
    }),
    spaces: spaces.map((room) => {
      const { exchangeBuildingId, exchangeRoomId, ...otherRoomProps } = room;
      return { ...otherRoomProps, openingHours: placeholderOpeningHours };
    }),
  };
};
