const { invoker } = require('ramda')

const toString = invoker(0, 'toString')

module.exports = { toString }
