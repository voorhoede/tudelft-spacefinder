const { writeFileSync } = require('fs')
const getAvailability = require('../../scripts/data/exchange/room-availability')
const exchangeIds = require('../../mock/exchange/emails.json')

// Force fetching fresh data from exchange
process.env.USE_MOCK_DATA_CMS = '0'

getAvailability(exchangeIds)
  .then((result) => {
    const json = JSON.stringify(result, null, 2)
    writeFileSync('./mock/exchange/availability.json', json)
  })
