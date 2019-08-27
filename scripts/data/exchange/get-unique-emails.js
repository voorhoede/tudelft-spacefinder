const {
  allPass,
  always,
  ascend,
  chain,
  filter,
  identity,
  ifElse,
  is,
  isEmpty,
  not,
  pick,
  pipe,
  sort,
  uniq,
  values,
} = require('ramda')

const isArrayWithItems = allPass([
  pipe(isEmpty, not),
  is(Array),
])

const getExchangeIds = chain(
  pipe(
    pick(['exchangeBuildingId', 'exchangeRoomId']),
    values
  )
)

const sortAscending = sort(ascend(identity))

module.exports = ifElse(
  isArrayWithItems,
  pipe(
    getExchangeIds,
    uniq,
    filter(pipe(isEmpty, not)),
    sortAscending
  ),
  always([])
)
