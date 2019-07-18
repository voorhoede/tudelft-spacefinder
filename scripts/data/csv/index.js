const { readFile } = require('fs')
const csvParser = require('csv-parse/lib/sync')
const transformSpaces = require('./transform-spaces')
const transformBuildings = require('./transform-buildings')
const parserOptions = require('./config')

module.exports = {
  parse: () => new Promise((resolve, reject) => {
    readFile('./data/studieplekken-mini.csv', 'utf8', (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(csvParser(data, parserOptions))
    })
  }),
  transform: ([ dataFromCsv, dataFromCms ]) => {
    return {
      spaces: transformSpaces(dataFromCsv),
      buildings: transformBuildings([ dataFromCsv, dataFromCms ])
    }
  }
}
