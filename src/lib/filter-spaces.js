export function spaceFilter({ filters, spaces }) {
  const filterKeys = Object.keys(filters)
  const activeFilterKeys = getActiveFilterKeys(filters, filterKeys)

  return filterSpaces(filters, spaces, activeFilterKeys)
}

function getActiveFilterKeys(filters, keys) {
  return keys.filter((key) => {
    const data = filters[key]
    return Array.isArray(data) ? !!data.length : data
  })
}

function filterSpaces(filters, spaces, activeFilterKeys) {
  return spaces.filter(space => filterSpace(filters, space, activeFilterKeys))
}

/*
  If the current time falls in any of the time ranges for today, we're in
  business
*/
export function spaceIsOpen(now, openingHours) {
  // first item in openingHours array is today
  const [{ time: timeRanges }] = openingHours
  return timeRanges
    // parse to date objects for comparison
    .map(range => range.map(item => new Date(item)))
    .some(([start, end]) => {
      return now >= start && now <= end
    })
}

function filterSpace(filters, space, activeFilterKeys) {
  const now = new Date()

  return activeFilterKeys.every((activeFilterKey) => {
    const facility = space.facilities[activeFilterKey]
    if (Array.isArray(filters[activeFilterKey])) {
      let filterValue = facility

      if (activeFilterKey === 'buildings') {
        filterValue = space.building.number
      }
      return filters[activeFilterKey].includes(filterValue)
    }

    if (activeFilterKey === 'showOpenLocations') {
      return spaceIsOpen(now, space.openingHours)
    }

    return facility
  })
}
