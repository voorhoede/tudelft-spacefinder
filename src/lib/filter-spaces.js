import slugifyToLowercase from './slugify'

export default function ({ filters, spaces }) {
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

function filterSpace(filters, space, activeFilterKeys) {
  return activeFilterKeys.every((activeFilterKey) => {
    const facility = space.facilities[activeFilterKey]

    if (Array.isArray(filters[activeFilterKey])) {
      let filterValue = facility

      if (activeFilterKey === 'buildings') {
        filterValue = slugifyToLowercase(space.building.abbreviation)
      }

      return filters[activeFilterKey].includes(filterValue)
    }

    return facility
  })
}
