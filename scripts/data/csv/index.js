const { readFile } = require('fs')
const { map } = require('ramda')
const csvParser = require('csv-parse/lib/sync')
const transformSpaces = require('./transform-spaces')
const transformBuildings = require('./transform-buildings')
const translate = require('./lib/translate')
const parserOptions = require('./config')

const translationMap = {
  name: {
    nl: 'buildingNameNL',
    en: 'buildingNameEN'
  },
  abbreviation: {
    nl: 'buildingAbbreviationNL',
    en: 'buildingAbbreviationEN'
  }
}

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
    const translatedDataFromCsv = map(translate(translationMap), dataFromCsv)

    return {
      spaces: transformSpaces(translatedDataFromCsv),
      buildings: transformBuildings([ translatedDataFromCsv, dataFromCms ])
    }
  }
})
