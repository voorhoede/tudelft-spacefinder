const slugify = require('slugify')

const {
  chain,
  converge,
  curry,
  head,
  identity,
  join,
  last,
  lensProp,
  map,
  mergeDeepRight,
  objOf,
  omit,
  over,
  pick,
  pipe,
  prop,
  propEq,
  toLower,
  transpose,
  values,
  uniqWith,
  trim
} = require('ramda')

const { splitByHyphen } = require('./lib')

const buildingProps = [
  'buildingId',
  'buildingNameNL',
  'buildingNameEN',
  'buildingAbbreviationNL',
  'buildingAbbreviationEN',
  'number'
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

const getBuildings = pipe(
  getUniqueBuildings,
  getBuildingNumbers,
  getBuildingProps,
  splitByLanguage(translationMap),
  map(map(pipe(
    getBuildingSlug,
    removeNamePrefix,
    removeUnnecessaryProps,
    removeNamePrefix
  )))
)

module.exports = getBuildings
