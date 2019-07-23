export default function ({ filters, spaces }) {
  return spaces.filter((space) => {
    const filterIsInactive = filters.quietness.length === 0
    const filterIsMatching = filters.quietness.includes(space.facilities.quietness)
    return filterIsInactive || filterIsMatching
  })
}
