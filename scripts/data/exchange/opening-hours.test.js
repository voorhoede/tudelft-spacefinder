const sinon = require('sinon')
const openingHours = require('./opening-hours')
const { buildingAndRoom } = require('./opening-hours-fixture.json')

let clock

beforeEach(() => {
  // set fake date
  clock = sinon.useFakeTimers(new Date('2019-07-30'))
})

afterEach(() => {
  clock.restore()
})

describe('space with building and room availability', () => {
  const { availability, spaces } = buildingAndRoom

  test('returns an array with an item for each day of the week ahead', () => {
    const [ result ] = openingHours(availability, spaces)
    const { openingHours: resultOpeningHours } = result
    expect(Array.isArray(resultOpeningHours)).toBe(true)
    expect(resultOpeningHours.length).toBe(7)
  })

  test('starts at the current weekday (forced to tuesday)', () => {
    const [ result ] = openingHours(availability, spaces)
    const { openingHours: resultOpeningHours } = result
    const [ { day } ] = resultOpeningHours
    expect(day).toBe('tu')
  })

  test('tuesday contains three time ranges', () => {
    const [ result ] = openingHours(availability, spaces)
    const { openingHours: resultOpeningHours } = result
    const [ tuesday ] = resultOpeningHours
    expect(tuesday.time.length).toBe(3)
  })
})
