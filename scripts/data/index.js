require('dotenv').config()

const { writeFile } = require('fs')
const getDataFromCms = require('./cms')
const { addOpeningHours } = require('./exchange')
const validate = require('./validate')

const { CSV_PATH: csvPath } = process.env

const { getData: getDataFromCsv, transform } = require('./csv')({ csvPath })

const writeFiles = (files = []) => {
  return Promise.all(files.map(({ name, contents }) => {
    const stringifiedData = JSON.stringify(contents, null, 2)
    return new Promise((resolve, reject) => {
      writeFile(`./src/static/data/${name}.json`, stringifiedData, 'utf8', (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }))
}

Promise.all([ getDataFromCsv(), getDataFromCms() ])
  .then(transform)
  .then(addOpeningHours)
  .then(validate)
  .then(({ spaces, buildings, openingHours }) => writeFiles([
    { name: 'spaces', contents: spaces },
    { name: 'buildings', contents: buildings },
    { name: 'opening-hours', contents: openingHours }
  ]))
  .then(() => console.info('Wrote data for spaces, buildings and opening hours'))
  .catch(({ message }) =>
    console.error(`An error occurred writing data: ${message}`)
  )
