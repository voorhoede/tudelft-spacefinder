const { readFileSync, writeFile } = require('fs')
const slugify = require('slugify')
const {
  applySpec,
  converge,
  filter,
  fromPairs,
  ifElse,
  invoker,
  identity,
  isNil,
  join,
  lensIndex,
  map,
  mergeDeepRight,
  not,
  objOf,
  over,
  pick,
  pipe,
  prop,
  reduce,
  replace,
  split,
  toLower,
  values,
  unapply,
  unary,
  tap,
  zip
} = require('ramda')
const csvParser = require('csv-parse/lib/sync')
const { space: spaceValidator } = require('./schema-validators')

const parserOptions = require('./config')

const fileContents = readFileSync('./data/studieplekken.csv', 'utf8')
const parsed = csvParser(fileContents, parserOptions)

const toString = invoker(0, 'toString')
const stringSlugify = pipe(toString, replace(/\./g, '-'), slugify, toLower)
const getSlug = pipe(
  pick(['id', 'roomId', 'roomName']),
  values,
  map(stringSlugify),
  join('--'),
  objOf('slug')
)

const getBuilding = pipe(
  prop('buildingId'),
  converge(
    mergeDeepRight,
    [
      pipe(
        split(' - '),
        over(lensIndex(0), parseInt),
        zip(['number', 'name']),
        fromPairs
      ),
      pipe(unary(slugify), toLower, objOf('slug'))
    ]
  ),
  objOf('building')
)

const getRoom = pipe(
  prop('roomId'),
  objOf('id'),
  objOf('room')
)

const facilities = [
  'seats',
  'tables',
  'adjustableChairs',
  'otherSeats',
  'studyType',
  'quietness',
  'bookable',
  'daylit',
  'powerOutlets',
  'ethernet',
  'stationaryPC',
  'otherFacilities',
  'whiteBoard',
  'smartBoard',
  'presentationScreen',
  'nearCoffeeMachine',
  'nearPrinter',
  'nearBathroom',
  'claimedByGroup'
]

const getFacilities = pipe(
  pick(facilities),
  objOf('facilities')
)

const getSpaceName = pipe(
  prop('roomName'),
  objOf('name')
)

const getFloor = pick(['floor'])

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

const getSpaces = pipe(
  map(
    pipe(
      // Create the space object
      converge(meld, [
        getBuilding,
        getRoom,
        getFloor,
        getFacilities,
        getSpaceName,
        getSlug
      ]),
      // validate against json schema
      applySpec({
        value: identity,
        errors: getSpaceErrors
      }),
      // log validation errors to console and return valid spaces only
      // ifElse(spaceHasErrors, logErrors, identity)
      ifElse(spaceHasErrors, logErrors, identity)
    )
  ),
  filter(pipe(spaceHasErrors, not)),
  map(prop('value'))
)

const spaces = getSpaces(parsed)

const writeSpaces = (lang, contents) => {
  const stringifiedData = JSON.stringify(contents, null, 2)
  return new Promise((resolve, reject) => {
    writeFile(`./src/static/data/${lang}/spaces.json`, stringifiedData, 'utf8', (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

Promise.all([ writeSpaces('nl', spaces), writeSpaces('en', spaces) ])
