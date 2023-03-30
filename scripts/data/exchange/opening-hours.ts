import type {
  BuildingI18n,
  CsvAndCmsBuildingData,
} from "./../../../src/types/Building";
import type { CsvSpaceData, SpaceI18n } from "./../../../src/types/Space";

import { DateRange, extendMoment } from "moment-range";
import Moment from "moment-timezone";
import type { OpeningHours } from "./../../../src/types/OpeningHours";
const moment = extendMoment(Moment);
moment.tz.setDefault("Europe/Amsterdam");

interface Availability {
  BusyType: string;
  StartTime: any;
  EndTime: any;
}

/*
  Iterate through a list of calendar entries, filtering by Free or Busy
  (Free for buildings, Busy for rooms)
  Produce an object containing the moment timerange for start and end time
  found in each availability in the list.
*/
const getTimeRanges = (availabilityData: Availability[], busyType: string) =>
  availabilityData
    .filter(({ BusyType: type }) => type === busyType)
    // make a moment daterange out of start and end date
    .map(({ StartTime: start, EndTime: end }) => {
      return moment.range(start, end);
    });

/*
  As Exchange may return a single availability item as an object instead of as
  an array, We should make sure it's an array.
*/
function ensureArray<T>(availabilityData: T | T[]) {
  if (!Array.isArray(availabilityData)) {
    return Array.of(availabilityData);
  }
  return availabilityData;
}

function subtractClosingTimes(
  buildingRanges: DateRange[],
  roomRanges: DateRange[] = []
) {
  return buildingRanges.map((buildingRange) => {
    return roomRanges
      .filter((roomRange) => {
        return buildingRange.contains(roomRange);
      })
      .reduce((openingHours, gap) => {
        // Result after successful subtraction of a time range, is an array of ranges
        const precedingRanges = openingHours.slice(0, openingHours.length - 1);
        const [lastRange] = openingHours.slice(-1);
        return [...precedingRanges, ...lastRange.subtract(gap)];
      }, Array.of(buildingRange.clone()));
  });
}

function getWeekDayRange() {
  const now = moment();
  const range = moment.range(now, now.clone().add(6, "day"));
  return Array.from(range.by("day", { step: 1 })).map((d) =>
    d.format("dd").toLowerCase()
  );
}

const fillMissingDays = (openingHours: OpeningHours[] = []) => {
  const days = getWeekDayRange();
  return days.reduce((acc, weekDay) => {
    const dayFromOpeningHours = openingHours.find(({ day }) => day === weekDay);
    if (!dayFromOpeningHours) {
      return [...acc, { day: weekDay, time: [] }];
    }
    return [...acc, dayFromOpeningHours];
  }, [] as OpeningHours[]);
};

function formatOpeningHours(ranges: DateRange[][] = []): OpeningHours[] {
  return ranges.map((range) => {
    // Determine the weekday by taking the start property off the first item.
    const first = range[0].start;
    const day = first.format("dd").toLowerCase();
    const time = range.map(
      (r) => [r.start, r.end].map((t) => t.utc().format()) as [string, string]
    );
    return { day, time };
  });
}

const getOpeningHoursForRooms = (building = [], room = []) => {
  if (!building.length) {
    return [];
  }
  // ignore 'busy' entries in building appointments
  const buildingOpenRanges = getTimeRanges(ensureArray(building), "Free");
  // ignore 'free' entries in room appointments
  const roomBusyRanges = getTimeRanges(ensureArray(room), "Busy");

  let rangesToFormat: DateRange[][];

  if (roomBusyRanges.length) {
    rangesToFormat = subtractClosingTimes(buildingOpenRanges, roomBusyRanges);
  } else {
    rangesToFormat = buildingOpenRanges.map((r) => Array.of(r));
  }

  const formattedOpeningHours = formatOpeningHours(rangesToFormat);
  const openingHoursWithDaysFilled = fillMissingDays(formattedOpeningHours);

  return openingHoursWithDaysFilled;
};

const getOpeningHoursForBuildings = (building = []) => {
  const buildingOpenRanges = getTimeRanges(ensureArray(building), "Free").map(
    (r) => Array.of(r)
  );

  const formattedOpeningHours = formatOpeningHours(buildingOpenRanges);
  const openingHoursWithDaysFilled = fillMissingDays(formattedOpeningHours);

  return openingHoursWithDaysFilled;
};

export function roomOpeningHours(
  availability: Record<string, any>,
  rooms: CsvSpaceData[] = []
): SpaceI18n[] {
  return rooms.map((room) => {
    const { exchangeBuildingId, exchangeRoomId, ...otherProps } = room;
    return {
      ...otherProps,
      openingHours: getOpeningHoursForRooms(
        availability[exchangeBuildingId],
        availability[exchangeRoomId]
      ),
    };
  });
}

export function buildingOpeningHours(
  availability: Record<string, any>,
  buildings: CsvAndCmsBuildingData[] = []
): BuildingI18n[] {
  return buildings.map((building) => {
    const { exchangeBuildingId, ...otherProps } = building;
    return {
      ...otherProps,
      openingHours: getOpeningHoursForBuildings(
        availability[exchangeBuildingId]
      ),
    };
  });
}
