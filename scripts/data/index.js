const { writeFile } = require('fs')
const getDataFromCms = require('./cms')
const { getData: getDataFromCsv, transform } = require('./csv')({
  csvPath: './data/studieplekken-mini.csv'
})

Promise.all([ getDataFromCsv(), getDataFromCms() ])
  .then(transform)
  // @TODO: write data some place sensible
  .then(r => console.log(r.buildings))

const writeFiles = (files = []) => {
  return Promise.all(files.map(({ name, contents }) => {
    const stringifiedData = JSON.stringify(contents)
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
    { name: 'spaces', contents: spaces },
    { name: 'buildings', contents: buildings }
  ]))
