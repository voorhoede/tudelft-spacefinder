const getRoomAvailability = require('./room-availability')
const getEmails = require('./get-unique-emails')
const mapRoomsToTimes = require('./rooms-to-times')
const openingHours = require('./opening-hours')

module.exports = async ({ spaces, buildings } = {}) => {
  const emails = getEmails(spaces)
  const availability = await getRoomAvailability(emails)
  const roomsToTimesMap = mapRoomsToTimes(emails, availability)
  const { buildings: b, rooms: s } = openingHours(roomsToTimesMap, { rooms: spaces, buildings })

  return { buildings: b, spaces: s }
}
