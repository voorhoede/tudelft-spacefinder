const { readFileSync, writeFile } = require('fs')
const csvParser = require('csv-parse/lib/sync')
const transform = require('./transform')
const parserOptions = require('./config')
const fileContents = readFileSync('./data/studieplekken-mini.csv', 'utf8')
const parsed = csvParser(fileContents, parserOptions)

const spaces = transform(parsed)

const writeSpaces = (lang, contents) => {
  const stringifiedData = JSON.stringify(contents, null, 2)
  return new Promise((resolve, reject) => {
    writeFile(`./src/static/data/${lang}/spaces.json`, stringifiedData, 'utf8', (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

Promise.all([ writeSpaces('nl', spaces), writeSpaces('en', spaces) ])
