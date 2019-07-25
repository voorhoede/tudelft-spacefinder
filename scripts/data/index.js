require('dotenv').config()

const { writeFile } = require('fs')
const getDataFromCms = require('./cms')

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
  .then(({ spaces, buildings }) => writeFiles([
    // @NOTICE: writing to language subdirectories for compatibility reasons.
    // Remove these at some point.
    { name: 'spaces', contents: spaces },
    { name: 'en/spaces', contents: spaces },
    { name: 'nl/spaces', contents: spaces },
    { name: 'buildings', contents: buildings },
    { name: 'en/buildings', contents: buildings },
    { name: 'nl/buildings', contents: buildings }
  ]))
