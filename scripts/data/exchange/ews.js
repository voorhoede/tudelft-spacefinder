// const getRoomAvailability = require('./room-availability')
// const getEmails = require('./get-unique-emails')
// const mapRoomsToTimes = require('./rooms-to-times')
// const openingHours = require('./opening-hours')

const placeholderOpeningHours = [
  {
    day: 'th',
    time: [['2020-10-29T06:00:00Z', '2020-10-29T17:00:00Z']],
  },
  {
    day: 'fr',
    time: [['2020-10-30T06:00:00Z', '2020-10-30T17:00:00Z']],
  },
  {
    day: 'sa',
    time: [],
  },
  {
    day: 'su',
    time: [],
  },
  {
    day: 'mo',
    time: [['2020-11-02T06:00:00Z', '2020-11-02T17:00:00Z']],
  },
  {
    day: 'tu',
    time: [['2020-11-03T06:00:00Z', '2020-11-03T17:00:00Z']],
  },
  {
    day: 'we',
    time: [['2020-11-04T06:00:00Z', '2020-11-04T17:00:00Z']],
  },
]

module.exports = ({ spaces, buildings } = {}) => {
  return {
    buildings: buildings.map((building) => {
      const { exchangeBuildingId, ...otherBuildingProps } = building
      return ({ ...otherBuildingProps, openingHours: placeholderOpeningHours })
    }),
    spaces: spaces.map((room) => {
      const { exchangeBuildingId, exchangeRoomId, ...otherRoomProps } = room
      return ({ ...otherRoomProps, openingHours: placeholderOpeningHours })
    }),
  }
}
