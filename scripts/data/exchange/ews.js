const getRoomAvailability = require('./room-availability')
const getEmails = require('./get-unique-emails')
const mapRoomsToTimes = require('./rooms-to-times')
const openingHours = require('./opening-hours')

module.exports = async (data = {}) => {
  const { spaces } = data
  const emails = getEmails(spaces)
  const availability = await getRoomAvailability(emails)
  const roomsToTimesMap = mapRoomsToTimes(emails, availability)
  const spacesWithOpeningHours = openingHours(roomsToTimesMap, spaces)

  return {
    ...data,
    spaces: spacesWithOpeningHours
  }
}
