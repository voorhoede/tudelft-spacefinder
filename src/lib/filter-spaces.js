export default function ({ filters, spaces }) {
  return spaces.filter((space) => {
    const filterIsInactive = filters.noiseLevel.length === 0
    const filterIsMatching = filters.noiseLevel.includes(space.facilities.quietness)
    return filterIsInactive || filterIsMatching
  })
}
