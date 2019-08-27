const moment = require('moment')

// Get iso date strings ranging from start of today to end of 6 days from now.
module.exports = () => ({
  start: moment().startOf('day').toISOString(true),
  end: moment().add(6, 'days').endOf('day').toISOString(true),
})
