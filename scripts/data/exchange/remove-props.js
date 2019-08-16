const {
  lift,
  map,
  omit
} = require('ramda')

const omitProps = omit(['exchangeBuildingId', 'exchangeRoomId'])

module.exports = lift(map(omitProps))
