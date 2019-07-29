const EWS = require('node-ews')

require('dotenv').config()

const {
  EWS_USER: username,
  EWS_PASS: password,
  EWS_HOST: host
} = process.env

const useMockData = process.env.USE_MOCK_DATA_EXCHANGE === '1'

const time = require('./time')

module.exports = (emailAddresses) => {
  const ewsClient = new EWS({ username, password, host })
  const { start, end } = time()
  if (useMockData) {
    return require('../../../mock/exchange/availability.json')
  } else {
    return ewsClient.run('GetUserAvailability', {
      TimeZone: {
        Id: 'Central Europe Standard Time'
      },
      MailboxDataArray: {
        MailboxData: emailAddresses.map(email => ({
          Email: {
            Address: email
          }
        }))
      },
      FreeBusyViewOptions: {
        TimeWindow: {
          StartTime: start,
          EndTime: end
        }
      }
    })
  }
}
