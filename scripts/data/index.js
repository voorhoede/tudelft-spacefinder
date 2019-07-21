const getDataFromCms = require('./cms')
const { getData: getDataFromCsv, transform } = require('./csv')({
  csvPath: './data/studieplekken-mini.csv'
})

Promise.all([ getDataFromCsv(), getDataFromCms() ])
  .then(transform)
  // @TODO: write data some place sensible
  .then(r => console.log(r.buildings))

// const writeSpaces = (lang, contents) => {
//   const stringifiedData = JSON.stringify(contents, null, 2)
//   return new Promise((resolve, reject) => {
//     writeFile(`./src/static/data/${lang}/spaces.json`, stringifiedData, 'utf8', (err) => {
//       if (err) {
//         return reject(err)
//       }
//       resolve()
//     })
//   })
// }

// Promise.all([ writeSpaces('nl', spaces), writeSpaces('en', spaces) ])
