const slugify = require('slugify')
const {
  converge,
  join,
  map,
  mergeDeepRight,
  objOf,
  over,
  pick,
  pipe,
  prop,
  reduce,
  replace,
  lensProp,
  toLower,
  values,
  unapply
} = require('ramda')

const { space } = require('../schema')
const {
  keepValidValues,
  toString,
  validate
} = require('./lib')

const { buildingNumberFromId } = require('./lib/building-meta')

const validator = validate(space)

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
  'exchangeId',
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
  map(
    pipe(
      // Create the space object
      converge(meld, [
        getRootProperties,
        getFacilities,
        getSpaceName,
        getBuildingNumber,
        getSlug
      ]),
      // log & append validation errors, if any
      validator,
      // @NOTICE: temporarily add a slug property to a space that is equal to
      // the building number
      over(lensProp('slug'), prop('buildingNumber'))
    )
  ),
  // remove values with errors from the result
  keepValidValues
)
