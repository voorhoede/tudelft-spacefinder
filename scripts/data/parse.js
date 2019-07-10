const { readFileSync } = require('fs')
const csvParser = require('csv-parse/lib/sync')
const parserOptions = require('./config')

const fileContents = readFileSync('./data/studieplekken.csv', 'utf8')
const parsed = csvParser(fileContents, parserOptions)

console.log(parsed)
