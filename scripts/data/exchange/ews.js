const getRoomAvailability = require('./room-availability')
const getEmails = require('./get-unique-emails')
const mapRoomsToTimes = require('./rooms-to-times')
const getOpeningHours = require('./opening-hours')
const removeProps = require('./remove-props')

module.exports = async ({ spaces, buildings } = {}) => {
  const emails = getEmails(spaces)
  const availability = await getRoomAvailability(emails)
  const roomsToTimesMap = mapRoomsToTimes(emails, availability)
  const openingHours = getOpeningHours(roomsToTimesMap, { rooms: spaces, buildings })
  const cleanedBuildingsAndSpaces = removeProps({ buildings, spaces })
  return { ...cleanedBuildingsAndSpaces, openingHours }
}
