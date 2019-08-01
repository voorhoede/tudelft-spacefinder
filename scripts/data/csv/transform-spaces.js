const slugify = require('slugify')
const {
  converge,
  join,
  map,
  mergeDeepRight,
  objOf,
  pick,
  pipe,
  prop,
  reduce,
  replace,
  toLower,
  values,
  unapply
} = require('ramda')

const { toString } = require('./lib/helpers')

const { buildingNumberFromId } = require('./lib/building-meta')

const stringSlugify = pipe(toString, replace(/\./g, '-'), slugify, toLower)

const getSlug = pipe(
  pick(['spaceId', 'spaceName']),
  values,
  map(stringSlugify),
  join('--'),
  objOf('slug')
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
  'nearBathroom',
  'claimedByGroup'
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

const getSpaceName = pipe(
  prop('spaceName'),
  objOf('name')
)

const getBuildingNumber = pipe(
  prop('buildingId'),
  buildingNumberFromId,
  objOf('buildingNumber')
)

const getRootProperties = pick(spaceRootProperties)

const meld = unapply(reduce(mergeDeepRight, {}))

module.exports = pipe(
  // Create the space object
  map(converge(meld, [
    getRootProperties,
    getFacilities,
    getSpaceName,
    getBuildingNumber,
    getSlug
  ]))
)
