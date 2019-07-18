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
  lensProp,
  lt,
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
  tap
} = require('ramda')

const { splitByHyphen } = require('./lib')

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
const atLeastOneInList = pipe(prop('length'), lt(2), not)

const joinAndFilter = pipe(
  apply(concat),
  groupBy(prop('number')),
  values,
  map(filter(atLeastOneInList)),
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
  map(map(pipe(
    // create or edit properties
    pipe(
      getBuildingSlug,
      removeNamePrefix,
      removeUnnecessaryProps,
      removeNamePrefix
    )
    // @TODO: validate against json schema
  ))),
  tap(v => console.dir(v, { depth: null }))
)

module.exports = getBuildings
