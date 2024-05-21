import type { Filters } from "~/types/Filters";
import type { Space } from "~/types/Space";

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
export function spaceIsOpen(now: Date, openingHours: any) {
  const hoursToday = openingHours[now.getUTCDate()]

  if (!hoursToday)
    return false

  return hoursToday
    .map((timeRange) => ({
      start: new Date(timeRange.start),
      end: new Date(timeRange.end),
    }))
    .some((timeRange) => (
      now >= timeRange.start && now <= timeRange.end
    ))
}

function filterSpace(
  filters: Filters,
  space: Space,
  activeFilterKeys: Array<keyof Filters>
) {
  const now = new Date();

  return activeFilterKeys.every((activeFilterKey) => {
    if (activeFilterKey == "showOpenLocations")
      return space.building.openingHoursPerDay
        && spaceIsOpen(now, space.building.openingHoursPerDay);
    if (activeFilterKey == "buildings")
      return filters.buildings.includes(space.buildingNumber);
    if (activeFilterKey == "quietness")
      return filters.quietness.includes(space.facilities.quietness);
    if (activeFilterKey == "buildingOccupancy")
      return (
        space.building.occupancy &&
        filters.buildingOccupancy.includes(space.building.occupancy)
      );

    return space.facilities[activeFilterKey];
  });
}
