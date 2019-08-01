const template = require('./soap-template')
const client = require('./soap-client')

require('dotenv').config()

const {
  EWS_USER: username,
  EWS_PASS: password,
  EWS_ENDPOINT: url
} = process.env
const useMockData = process.env.USE_MOCK_DATA_EXCHANGE === '1'
const time = require('./time')

module.exports = (emailAddresses) => {
  const soapClient = client({ username, password, url })
  const { start, end } = time()
  const soapDocument = template({
    emails: emailAddresses,
    start,
    end
  })
  if (useMockData) {
    return require('../../../mock/exchange/availability.json')
  } else {
    return soapClient(soapDocument)
  }
}
