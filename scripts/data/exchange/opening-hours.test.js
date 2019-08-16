const sinon = require('sinon')
const buildingAndRoomFixture = require('./opening-hours-fixture.json').buildingAndRoom
const getOpeningHours = require('./opening-hours')

const getOpeningHoursResult = ({ spaces: rooms, availability, buildings } = {}) => {
  return getOpeningHours(availability, { buildings, rooms })
}

let clock

beforeEach(() => {
  // set fake date
  clock = sinon.useFakeTimers(new Date('2019-07-30'))
})

afterEach(() => {
  clock.restore()
})

describe('space with building and room availability', () => {
  const result = getOpeningHoursResult(buildingAndRoomFixture)
  test('returns an array with opening hours for buildings and spaces', () => {
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
  })

  test('result has an item with the building\'s `buidingId` as `id`', () => {
    const [{ buildingId }] = buildingAndRoomFixture.buildings
    const hasBuildingId = result.find(({ id }) => id === buildingId)
    expect(hasBuildingId).toBeTruthy()
  })

  test('result has an item with the space\'s `spaceId` as `id`', () => {
    const [{ spaceId }] = buildingAndRoomFixture.spaces
    const hasSpaceId = result.find(({ id }) => id === spaceId)
    expect(hasSpaceId).toBeTruthy()
  })

  test('starts at the current weekday (forced to tuesday)', () => {
    const result = getOpeningHoursResult(buildingAndRoomFixture)
    const [ { openingHours: [{ day }] } ] = result
    expect(day).toBe('tu')
  })

  test('tuesday contains three time ranges', () => {
    const result = getOpeningHoursResult(buildingAndRoomFixture)
    const [ , { openingHours: [{ time }] } ] = result
    expect(time.length).toBe(3)
  })
})
