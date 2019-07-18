const slugify = require('slugify')
const {
  converge,
  fromPairs,
  invoker,
  lensIndex,
  mergeDeepRight,
  objOf,
  over,
  pipe,
  split,
  toLower,
  unary,
  zip
} = require('ramda')

const hyphenRegex = /\s?-\s?/g
const toString = invoker(0, 'toString')
const splitByHyphen = split(hyphenRegex)

const getBuildingDetails = converge(
  mergeDeepRight,
  [
    pipe(
      split(hyphenRegex),
      over(lensIndex(0), parseInt),
      zip(['number', 'name']),
      fromPairs
    ),
    pipe(unary(slugify), toLower, objOf('slug'))
  ]
)

module.exports = {
  hyphenRegex,
  getBuildingDetails,
  splitByHyphen,
  toString
}
