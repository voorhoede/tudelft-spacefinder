const {
  adjust,
  apply,
  concat,
  converge,
  dissoc,
  filter,
  groupBy,
  identity,
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

const { building } = require('../schema')
const { keepValidValues, validate } = require('./lib')
const { fromI18n } = require('./lib/building-meta')
const validator = validate(building)

const buildingProps = [
  'buildingId',
  'buildingNameNL',
  'buildingNameEN',
  'buildingAbbreviationNL',
  'buildingAbbreviationEN',
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
  getBuildingProps,
  map(validator),
  keepValidValues,
  // @NOTICE: temporarily add a slug property to a building that is equal to
  // the building number
  map(converge(mergeDeepRight, [
    pipe(
      prop('number'),
      objOf('slug')
    ),
    identity
  ]))
)

module.exports = getBuildings
