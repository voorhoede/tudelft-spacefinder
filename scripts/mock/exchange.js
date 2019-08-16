const { writeFileSync } = require('fs')
const getAvailability = require('../../scripts/data/exchange/room-availability')
const exchangeIds = require('../../mock/exchange/emails.json')

getAvailability(exchangeIds)
  .then((result) => {
    const json = JSON.stringify(result, null, 2)
    writeFileSync('./mock/exchange/availability.json', json)
  })
