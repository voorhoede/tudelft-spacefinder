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

const { space } = require('../schema')
const {
  getBuildingDetails,
  keepValidValues,
  toString,
  validate
} = require('./lib')

const validator = validate(space)

const stringSlugify = pipe(toString, replace(/\./g, '-'), slugify, toLower)

const getSlug = pipe(
  pick(['spaceId', 'spaceName']),
  values,
  map(stringSlugify),
  join('--'),
  objOf('slug')
)

const getBuilding = pipe(
  prop('buildingId'),
  getBuildingDetails,
  objOf('building')
)

const getRoom = pipe(
  prop('roomId'),
  objOf('id'),
  objOf('room')
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
  'exchangeId',
  'floor',
  'seats',
  'tables',
  'latitude',
  'longitude'
]

const getFacilities = pipe(
  pick(facilities),
  objOf('facilities')
)

const getSpaceName = pipe(
  prop('spaceName'),
  objOf('name')
)

const getRootProperties = pick(spaceRootProperties)

const meld = unapply(reduce(mergeDeepRight, {}))

module.exports = pipe(
  map(
    pipe(
      // Create the space object
      converge(meld, [
        getBuilding,
        getRoom,
        getRootProperties,
        getFacilities,
        getSpaceName,
        getSlug
      ]),
      // log & append validation errors, if any
      validator
    )
  ),
  // remove values with errors from the result
  keepValidValues
)
