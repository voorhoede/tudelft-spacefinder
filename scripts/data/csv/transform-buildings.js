const {
  adjust,
  apply,
  concat,
  converge,
  dissoc,
  filter,
  groupBy,
  isEmpty,
  length,
  lensProp,
  lte,
  map,
  mergeDeepRight,
  mergeDeepLeft,
  not,
  objOf,
  over,
  path,
  pick,
  pipe,
  prop,
  propEq,
  reduce,
  values,
  uniqWith
} = require('ramda')

const { fromI18n } = require('./lib/building-meta')

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
  'i18n'
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

const getBuildingMeta = pipe(
  over(lensProp('i18n'), map(fromI18n)),
  converge(mergeDeepRight, [
    pipe(
      path(['i18n', 'en', 'number']),
      objOf('number')
    ),
    over(lensProp('i18n'), map(dissoc('number')))
  ])
)
// insert an array with:
//   0. <array> parsed csv
//   1. <array> content from dato cms
const getBuildings = pipe(
  adjust(0, pipe(
    getUniqueBuildings,
    map(getBuildingMeta)
  )),
  joinAndFilter,
  getBuildingProps
)

module.exports = getBuildings
