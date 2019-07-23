const buildingMeta = require('./building-meta')

const data = {
  buildingName: '13 - Architecture',
  abbreviation: 'Arch'
}

test('returns an object with the expected properties', () => {
  const result = buildingMeta(data)
  expect(result.number).toBe(13)
  expect(result.name).toBe('Architecture')
  expect(result.slug).toBe('13-arch')
})

test('is able to handle bad data', () => {
  let result = buildingMeta({ foo: 'bar' })
  expect(result).toEqual({})

  result = buildingMeta({ buildingName: 'foo' })
  expect(result).toEqual({})

  result = buildingMeta({ buildingName: '12-bad', abbreviation: '' })
  expect(result).toEqual({})
})

test('result does not contain source properties', () => {
  const result = buildingMeta(data)
  expect(result.hasOwnProperty('buildingName')).toBe(false)
  expect(result.hasOwnProperty('abbreviation')).toBe(false)
})
