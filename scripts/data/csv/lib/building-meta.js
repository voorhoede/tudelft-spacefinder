const {
  allPass,
  always,
  converge,
  dissoc,
  equals,
  ifElse,
  is,
  isEmpty,
  join,
  length,
  lensIndex,
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
  values,
  zipObj
} = require('ramda')

const slugify = require('slugify')

const arrayHasTwoItems = pipe(length, equals(2))

const isOkBuildingName = pipe(
  prop('buildingName'),
  test(/^\d{2}\s?-\s?[a-zA-Z]+$/)
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
    dissoc('buildingName'),
    pipe(
      prop('buildingName'),
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
    dissoc('abbreviation'),
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

module.exports = ifElse(
  isOkData,
  pipe(
    pick(['abbreviation', 'buildingName']),
    getBuildingNameAndNumber,
    getBuildingSlug
  ),
  always({})
)
