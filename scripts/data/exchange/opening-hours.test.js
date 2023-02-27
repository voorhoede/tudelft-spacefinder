import openingHours from './opening-hours'
import { buildingAndRoom } from './opening-hours-fixture.json'

beforeEach(() => {
  // set fake date
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2019-07-30'))
})

afterEach(() => {
  vi.useRealTimers();
})

describe('space with building and room availability', () => {
  const { availability, spaces } = buildingAndRoom

  test('returns an array with an item for each day of the week ahead', () => {
    const { rooms: [result] } = openingHours(availability, { rooms: spaces })
    const { openingHours: resultOpeningHours } = result
    expect(Array.isArray(resultOpeningHours)).toBe(true)
    expect(resultOpeningHours.length).toBe(7)
  })

  test('starts at the current weekday (forced to tuesday)', () => {
    const { rooms: [result] } = openingHours(availability, { rooms: spaces })
    const { openingHours: resultOpeningHours } = result
    const [{ day }] = resultOpeningHours
    expect(day).toBe('tu')
  })

  test('tuesday contains three time ranges', () => {
    const { rooms: [result] } = openingHours(availability, { rooms: spaces })
    const { openingHours: resultOpeningHours } = result
    const [tuesday] = resultOpeningHours
    expect(tuesday.time.length).toBe(3)
  })
})
