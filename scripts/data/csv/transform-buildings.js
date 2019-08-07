const {
  adjust,
  apply,
  chain,
  concat,
  converge,
  dissoc,
  filter,
  groupBy,
  head,
  identity,
  isEmpty,
  length,
  lensIndex,
  lensProp,
  lte,
  map,
  mergeDeepRight,
  mergeDeepLeft,
  not,
  objOf,
  over,
  pick,
  pipe,
  prop,
  propOr,
  propEq,
  reduce,
  set,
  sum,
  values,
  uniqWith
} = require('ramda')

const translate = require('./lib/translate')
const { meld } = require('./lib/helpers')
const { fromI18n, buildingNumberFromId } = require('./lib/building-meta')

const translationMap = {
  name: {
    nl: 'buildingNameNL',
    en: 'buildingNameEN'
  },
  abbreviation: {
    nl: 'buildingAbbreviationNL',
    en: 'buildingAbbreviationEN'
  }
}

const buildingProps = [
  'buildingId',
  'buildingNameNL',
  'buildingNameEN',
  'buildingAbbreviationNL',
  'buildingAbbreviationEN',
  'exchangeBuildingId',
  'number',
  'bounds',
  'image',
  'i18n',
  'totalSeats',
  'totalSpaces'
]

const getBuildingProps = map(pick(buildingProps))
const getUniqueBuildings = uniqWith(propEq('buildingId'))
const atLeastOneInList = pipe(length, lte(2))

const joinAndFilter = pipe(
  apply(concat),
  groupBy(prop('number')),
  values,
  filter(atLeastOneInList),
  map(reduce(mergeDeepLeft, {})),
  filter(pipe(isEmpty, not))
)

const getBuildingId = converge(mergeDeepRight, [
  identity,
  pipe(
    prop('buildingId'),
    buildingNumberFromId,
    objOf('number')
  )
])

const getBuildingMeta = over(lensProp('i18n'), map(pipe(
  fromI18n,
  dissoc('number')
)))

const setFirstElement = set(lensIndex(0))
const getTotalSeatsObject = pipe(
  map(propOr(0, 'seats')),
  sum,
  objOf('totalSeats')
)
const getTotalSpacesObject = pipe(
  length,
  objOf('totalSpaces')
)
const mergeHeadWithSeatsAndSpaces = converge(meld, [
  getTotalSeatsObject,
  getTotalSpacesObject,
  head
])

const getTotalSeatsAndSpaces = pipe(
  groupBy(prop('buildingId')),
  values,
  chain(converge(setFirstElement, [
    mergeHeadWithSeatsAndSpaces,
    identity
  ]))
)

// insert an array with:
//   0. <array> parsed csv
//   1. <array> content from dato cms
const getBuildings = pipe(
  adjust(0, pipe(
    getTotalSeatsAndSpaces,
    getUniqueBuildings,
    map(pipe(
      translate(translationMap),
      getBuildingId,
      getBuildingMeta
    ))
  )),
  joinAndFilter,
  getBuildingProps
)

module.exports = getBuildings
