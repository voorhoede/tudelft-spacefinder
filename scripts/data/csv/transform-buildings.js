const slugify = require('slugify')

const {
  adjust,
  apply,
  chain,
  concat,
  converge,
  curry,
  filter,
  groupBy,
  head,
  identity,
  isEmpty,
  join,
  last,
  length,
  lensProp,
  lte,
  map,
  mergeDeepRight,
  mergeDeepLeft,
  not,
  objOf,
  omit,
  over,
  pick,
  pipe,
  prop,
  propEq,
  reduce,
  toLower,
  transpose,
  values,
  uniqWith,
  trim,
  zipObj
} = require('ramda')

const { building } = require('../schema')
const { splitByHyphen, keepValidValues, validate } = require('./lib')
const validator = validate(building)

const buildingProps = [
  'buildingId',
  'buildingNameNL',
  'buildingNameEN',
  'buildingAbbreviationNL',
  'buildingAbbreviationEN',
  'number',
  'bounds',
  'image'
]

const getBuildingProps = map(pick(buildingProps))
const getBuildingNumberObject = pipe(
  prop('buildingId'),
  splitByHyphen,
  head,
  parseInt,
  objOf('number')
)
const getBuildingNumbers = map(converge(mergeDeepRight, [
  getBuildingNumberObject,
  identity
]))

const getUniqueBuildings = uniqWith(propEq('buildingId'))

const getPropsToRemove = pipe(
  values,
  chain(values)
)

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

const languages = ['nl', 'en']

const splitByLanguage = curry((translationMap, buildingData) => {
  const propsToRemove = getPropsToRemove(translationMap)
  const translatedBuildings = buildingData.map((building) => {
    return languages.map((lang) => {
      const translations = Object.keys(translationMap).reduce((obj, key) => {
        return {
          ...obj,
          [key]: building[translationMap[key][lang]]
        }
      }, {})
      const b = omit(propsToRemove, building)
      return {
        ...b,
        ...translations
      }
    })
  })
  // return an array of translated building for each language.
  return transpose(translatedBuildings)
})

const createSlug = pipe(
  pick(['number', 'abbreviation']),
  values,
  join('-'),
  slugify,
  toLower,
  objOf('slug')
)

const getBuildingSlug = converge(mergeDeepRight, [
  createSlug,
  identity
])
const removeUnnecessaryProps = omit(['abbreviation'])
const removeNamePrefix = over(lensProp('name'), pipe(
  splitByHyphen,
  last,
  trim
))
const atLeastOneInList = pipe(length, lte(2))

const joinAndFilter = pipe(
  apply(concat),
  groupBy(prop('number')),
  values,
  filter(atLeastOneInList),
  map(reduce(mergeDeepLeft, {})),
  filter(pipe(isEmpty, not))
)
// insert an array with:
//   0. <array> parsed csv
//   1. <array> content from dato cms
const getBuildings = pipe(
  adjust(0, pipe(
    getUniqueBuildings,
    getBuildingNumbers
  )),
  joinAndFilter,
  getBuildingProps,
  splitByLanguage(translationMap),
  map(
    pipe(
      map(
        pipe(
          // create / edit properties and validate objects
          getBuildingSlug,
          removeNamePrefix,
          removeUnnecessaryProps,
          removeNamePrefix,
          validator
        )
      ),
      keepValidValues
    )
  ),
  zipObj(['nl', 'en'])
)

module.exports = getBuildings
