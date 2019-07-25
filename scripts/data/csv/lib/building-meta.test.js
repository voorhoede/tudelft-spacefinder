const { fromI18n, buildingNumberFromId } = require('./building-meta')

const data = {
  someProperty: 'some value',
  name: '13 - Architecture',
  abbreviation: 'Arch'
}

test('returns an object with the expected properties', () => {
  const result = fromI18n(data)
  expect(result.number).toBe(13)
  expect(result.name).toBe('Architecture')
  expect(result.slug).toBe('13-arch')
})

test('is able to handle bad data', () => {
  let result = fromI18n({ foo: 'bar' })
  expect(result).toEqual({})

  result = fromI18n({ name: 'foo' })
  expect(result).toEqual({})

  result = fromI18n({ name: '12-bad', abbreviation: '' })
  expect(result).toEqual({})
})

test('parse the building number from a building id', () => {
  let result = buildingNumberFromId('04 - some building name')
  expect(result).toBe(4)
  result = buildingNumberFromId('no building number here')
  expect(result).toBe(null)
})
