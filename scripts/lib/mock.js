const {
  flip,
  intersection,
  map,
  mergeDeepRight,
  objOf,
  pipe,
  reduce,
  split,
  toLower,
} = require('ramda')

const transFormInput = pipe(toLower, split(','))
const filterAllowedValues = intersection(['exchange', 'dato'])
const createFlagObject = flip(objOf)(true)
const mergeAll = reduce(mergeDeepRight, {})

const createMockFlags = pipe(
  transFormInput,
  filterAllowedValues,
  map(createFlagObject),
  mergeAll
)

module.exports = (sourcesToMock = '') => {
  return createMockFlags(sourcesToMock)
}
