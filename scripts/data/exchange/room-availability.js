const template = require('./soap-template')
const client = require('./soap-client')
const time = require('./time')

require('dotenv').config()

const {
  EWS_USER: username,
  EWS_PASS: password,
  EWS_ENDPOINT: url
} = process.env

module.exports = (emailAddresses, useMockData = false) => {
  const soapClient = client({ username, password, url })
  const { start, end } = time()
  const soapDocument = template({
    emails: emailAddresses,
    start,
    end
  })
  if (useMockData) {
    return Promise.resolve(require('../../../mock/exchange/availability.json'))
  } else {
    return soapClient(soapDocument)
  }
}
