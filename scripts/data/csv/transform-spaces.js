const slugify = require('slugify')
const {
  applySpec,
  converge,
  filter,
  ifElse,
  identity,
  isNil,
  join,
  map,
  mergeDeepRight,
  not,
  objOf,
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

const { space: spaceValidator } = require('../schema')
const { getBuildingDetails, toString } = require('./lib')

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

const getSpaceErrors = (value) => {
  // validator errors will be stored on the function itself. Validator is run
  // for side effects only
  spaceValidator(value)
  // Errors will be an array or null
  return spaceValidator.errors
}

const spaceHasErrors = pipe(prop('errors'), isNil, not)

const logErrors = tap(({ value: { slug }, errors }) => {
  const errorText = [`${slug} did not pass json schema validation:`]
    .concat(errors.map((error) => {
      const { dataPath, message, data } = error
      return `> ${dataPath || ''} ${message}. Got ${data}`
    }))
  /* eslint-disable-next-line no-console */
  console.warn(errorText.join('\n'))
})

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
      // validate against json schema
      applySpec({
        value: identity,
        errors: getSpaceErrors
      }),
      // log validation errors to console
      ifElse(spaceHasErrors, logErrors, identity)
    )
  ),
  // filter out invalid spaces
  filter(pipe(spaceHasErrors, not)),
  map(prop('value'))
)
