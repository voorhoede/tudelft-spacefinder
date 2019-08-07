const {
  allPass,
  anyPass,
  always,
  converge,
  dissoc,
  equals,
  head,
  identity,
  ifElse,
  is,
  isEmpty,
  isNil,
  join,
  length,
  lensIndex,
  match,
  mergeDeepRight,
  not,
  objOf,
  over,
  pick,
  pipe,
  prop,
  split,
  test,
  toLower,
  unary,
  values,
  zipObj
} = require('ramda')

const slugify = require('slugify')

const arrayHasTwoItems = pipe(length, equals(2))
const testBuildingId = test(/^\d{2}\s?-\s?.+$/)
const isOkBuildingName = pipe(
  prop('name'),
  testBuildingId
)
const isOkAbbreviation = pipe(
  prop('abbreviation'),
  allPass([
    pipe(
      isEmpty,
      not
    ),
    is(String)
  ])
)
const isOkData = allPass([ isOkBuildingName, isOkAbbreviation ])

const getBuildingNameAndNumber = converge(
  mergeDeepRight,
  [
    identity,
    pipe(
      prop('name'),
      split(/\s?-\s?/g),
      ifElse(
        arrayHasTwoItems,
        pipe(
          over(lensIndex(0), parseInt),
          zipObj(['number', 'name'])
        ),
        always({})
      )
    )
  ]
)

const getBuildingSlug = converge(
  mergeDeepRight,
  [
    identity,
    pipe(
      pick(['number', 'abbreviation']),
      values,
      join('-'),
      slugify,
      toLower,
      objOf('slug')
    )
  ]
)
const fromI18n = ifElse(
  isOkData,
  pipe(
    pick(['abbreviation', 'name']),
    getBuildingNameAndNumber,
    getBuildingSlug,
    dissoc('number')
  ),
  always({})
)

const isEmptyOrNil = anyPass([isEmpty, isNil])

const buildingNumberFromId = pipe(
  match(/^\d{2}/),
  head,
  ifElse(isEmptyOrNil, always(null), unary(parseInt))
)

module.exports = {
  fromI18n,
  buildingNumberFromId
}
