const {
  allPass,
  always,
  converge,
  equals,
  identity,
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
  prop('name'),
  test(/^\d{2}\s?-\s?.+$/)
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

module.exports = ifElse(
  isOkData,
  pipe(
    pick(['abbreviation', 'name']),
    getBuildingNameAndNumber,
    getBuildingSlug
  ),
  always({})
)
