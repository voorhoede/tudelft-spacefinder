const {
  invoker,
  mergeDeepRight,
  reduce,
  unapply
} = require('ramda')

const meld = unapply(reduce(mergeDeepRight, {}))
const toString = invoker(0, 'toString')

module.exports = { meld, toString }
