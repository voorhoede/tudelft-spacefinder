import type { Filters } from "~/types/Filters";
import type { Space } from "~/types/Space";
import { OpeningHours } from "~/types/OpeningHours";

export function spaceFilter(spaces: Space[], filters: Filters) {
  const filterKeys = Object.keys(filters) as Array<keyof Filters>;
  const activeFilterKeys = getActiveFilterKeys(filters, filterKeys);

  return filterSpaces(filters, spaces, activeFilterKeys);
}

function getActiveFilterKeys(filters: Filters, keys: Array<keyof Filters>) {
  return keys.filter((key) => {
    const data = filters[key];
    return Array.isArray(data) ? !!data.length : data;
  });
}

function filterSpaces(
  filters: Filters,
  spaces: Space[],
  activeFilterKeys: Array<keyof Filters>
) {
  return spaces.filter((space) =>
    filterSpace(filters, space, activeFilterKeys)
  );
}

/*
  If the current time falls in any of the time ranges for today, we're in
  business
*/
export function spaceIsOpen(now: Date, openingHours: OpeningHours[]) {
  // first item in openingHours array is today
  const [{ time: timeRanges }] = openingHours;
  return (
    timeRanges
      // parse to date objects for comparison
      .map((range) => range.map((item) => new Date(item)))
      .some(([start, end]) => {
        return now >= start && now <= end;
      })
  );
}

function filterSpace(
  filters: Filters,
  space: Space,
  activeFilterKeys: Array<keyof Filters>
) {
  const now = new Date();

  return activeFilterKeys.every((activeFilterKey) => {
    const facility = space.facilities[activeFilterKey];
    if (Array.isArray(filters[activeFilterKey])) {
      let filterValue = facility;

      if (activeFilterKey === "buildings") {
        filterValue = space.building.number;
      }
      return filters[activeFilterKey].includes(filterValue);
    }

    if (activeFilterKey === "showOpenLocations") {
      return spaceIsOpen(now, space.openingHours);
    }

    return facility;
  });
}
