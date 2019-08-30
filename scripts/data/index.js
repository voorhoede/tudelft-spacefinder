require('dotenv').config()

const { writeFile } = require('fs')
const { getBuildingsDataFromCms, getInfoDataFromCms, convertInfoPage } = require('./cms')
const { addOpeningHours } = require('./exchange')
const validate = require('./validate')

const { CSV_PATH: csvPath } = process.env

const { getData: getDataFromCsv, transform } = require('./csv')({ csvPath })

const writeFiles = (files = []) => {
  return Promise.all(files.map(({ path, contents }) => {
    const stringifiedData = JSON.stringify(contents, null, 2)
    return new Promise((resolve, reject) => {
      writeFile(`./src/static/data/${path}.json`, stringifiedData, 'utf8', (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }))
}

Promise.all([
  getDataFromCsv(),
  getBuildingsDataFromCms(),
  getInfoDataFromCms(),
])
  .then(([csv, buildings, info]) => Promise.all([
    Promise.resolve(transform([csv, buildings]))
      .then(addOpeningHours)
      .then(validate),
    info,
  ]))
  .then(([ { spaces, buildings }, info ]) => {
    const infoPage = convertInfoPage(info)
    return [spaces, buildings, infoPage]
  })
  .then(([spaces, buildings, infoPage]) => writeFiles([
    { path: 'spaces', contents: spaces },
    { path: 'buildings', contents: buildings },
    { path: 'infopage', contents: infoPage },
  ]))
  .then(() => console.info('Wrote data for spaces, buildings and infopage'))
  .catch(({ message }) =>
    console.error(`An error occurred writing data: ${message}`)
  )
