const slugify = require('slugify')
const {
  always,
  apply,
  converge,
  identity,
  join,
  juxt,
  lensProp,
  map,
  mergeDeepRight,
  objOf,
  over,
  pick,
  pipe,
  prop,
  reduce,
  replace,
  toLower,
  values,
  unapply,
  tap
} = require('ramda')

const translate = require('./lib/translate')
const { toString } = require('./lib')
const { buildingNumberFromId } = require('./lib/building-meta')
const stringSlugify = pipe(toString, replace(/\./g, '-'), slugify, toLower)

const translationMap = {
  spaceName: {
    nl: 'spaceNameNL',
    en: 'spaceNameEN'
  }
}

const createSlugObject = pipe(
  map(stringSlugify),
  join('--'),
  objOf('slug')
)

/*
  This function expects the i18n object to be present on spaceData passed in
*/
const getSlug = pipe(
  juxt([ prop('spaceId'), identity ]),
  apply((id, space) => {
    return over(lensProp('i18n'), map(pipe(
      converge(mergeDeepRight, [ identity, pipe(
        juxt([ always(id), prop('spaceName') ]),
        createSlugObject
      )])
    )), space)
  })
)

const facilities = [
  'adjustableChairs',
  'otherSeats',
  'studyType',
  'quietness',
  'bookable',
  'daylit',
  'powerOutlets',
  'ethernet',
  'stationaryPC',
  'whiteBoard',
  'smartBoard',
  'presentationScreen',
  'nearCoffeeMachine',
  'nearPrinter',
  'nearBathroom'
]

const spaceRootProperties = [
  'exchangeBuildingId',
  'exchangeRoomId',
  'floor',
  'seats',
  'tables',
  'latitude',
  'longitude',
  'i18n',
  'roomId'
]

const getFacilities = pipe(
  pick(facilities),
  objOf('facilities')
)

const getBuildingNumber = pipe(
  prop('buildingId'),
  buildingNumberFromId,
  objOf('buildingNumber')
)

const getRootProperties = pick(spaceRootProperties)

const meld = unapply(reduce(mergeDeepRight, {}))

module.exports = map(
  pipe(
    translate(translationMap),
    getSlug,
    // Create the space object
    converge(meld, [
      getRootProperties,
      getFacilities,
      getBuildingNumber
    ])
  )
)
