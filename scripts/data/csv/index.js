const { readFile } = require('fs')
const csvParser = require('csv-parse/lib/sync')
const transformSpaces = require('./transform-spaces')
const transformBuildings = require('./transform-buildings')
const parserOptions = require('./config')

module.exports = ({ csvPath }) => ({
  getData: () => new Promise((resolve, reject) => {
    readFile(csvPath, 'utf8', (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(csvParser(data, parserOptions))
    })
  }),
  transform: ([ dataFromCsv, dataFromCms ]) => {
    return {
      spaces: transformSpaces(dataFromCsv),
      buildings: transformBuildings([ dataFromCsv, dataFromCms ]),
    }
  },
})
