require('dotenv').config()

const { writeFile } = require('fs')
const {
  getBuildingsDataFromCms,
  getInfoDataFromCms,
  getFeedbackPageFromCms,
  getOnboardingDataFromCms,
  convertCmsInfo,
} = require('./cms')
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
  getFeedbackPageFromCms(),
  getOnboardingDataFromCms(),
])
  .then(([csv, buildings, info, feedback, onboarding]) => Promise.all([
    Promise.resolve(transform([csv, buildings]))
      .then(addOpeningHours)
      .then(validate),
    info,
    feedback,
    onboarding,
  ]))
  .then(([{ spaces, buildings }, info, feedback, onboarding]) => {
    const infoPage = convertCmsInfo(info)
    const feedbackPage = convertCmsInfo(feedback)
    return [spaces, buildings, infoPage, feedbackPage, convertCmsInfo(onboarding)]
  })
  .then(([spaces, buildings, infoPage, feedbackPage, onboarding]) => writeFiles([
    { path: 'spaces', contents: spaces },
    { path: 'buildings', contents: buildings },
    { path: 'infopage', contents: infoPage },
    { path: 'feedbackpage', contents: feedbackPage },
    { path: 'onboarding', contents: onboarding },
  ]))
  .then(() => console.info('Wrote data for spaces, buildings and CMS'))
  .catch(({ message }) =>
    console.error(`An error occurred writing data: ${message}`)
  )
