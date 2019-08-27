const { fromI18n, buildingNumberFromId } = require('./building-meta')

const data = {
  someProperty: 'some value',
  name: '13 - Architecture',
  abbreviation: 'Arch',
}

test('fromI18n returns expected properties', () => {
  expect(fromI18n(data)).toEqual({
    'abbreviation': 'Arch',
    'name': 'Architecture',
    'slug': '13-arch',
  })
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
