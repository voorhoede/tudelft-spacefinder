const {
  filter,
  fromPairs,
  isNil,
  last,
  map,
  not,
  pathOr,
  pipe,
  transpose,
  unapply,
} = require('ramda')

const getCalendarList = pathOr([], [
  'FreeBusyResponseArray',
  'FreeBusyResponse',
])

const getCalendarEvents = map(pathOr(null, [
  'FreeBusyView',
  'CalendarEventArray',
  'CalendarEvent',
]))

const getEvents = pipe(
  getCalendarList,
  getCalendarEvents
)

const calendarNotNil = pipe(
  last,
  isNil,
  not
)

const getCalendarsToIdMap = pipe(
  unapply(transpose),
  filter(calendarNotNil),
  fromPairs
)

module.exports = (exchangeIds, availabilityResponse) => {
  const events = getEvents(availabilityResponse)
  return getCalendarsToIdMap(exchangeIds, events)
}
