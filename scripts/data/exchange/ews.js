const getRoomAvailability = require('./room-availability')
const getEmails = require('./get-unique-emails')
const mapRoomsToTimes = require('./rooms-to-times')

module.exports = async (data = {}) => {
  const { spaces } = data
  const emails = getEmails(spaces)
  const availability = await getRoomAvailability(emails)
  const roomsToTimesMap = mapRoomsToTimes(emails, availability)
  // @TODO: figure it out
  return 'useful data'
}
