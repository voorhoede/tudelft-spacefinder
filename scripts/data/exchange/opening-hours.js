const { extendMoment } = require('moment-range');
const moment = extendMoment(require('moment'))

module.exports = (availability, spaces) => {
  const today = moment()
  console.log(today)
}
