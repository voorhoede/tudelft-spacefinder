const cms = require('./cms')
const { parse, transform } = require('./csv')

// Promise.all([ Promise.resolve([]), Promise.resolve([]) ])
Promise.all([ parse(), cms() ])
  .then(transform)
  // .then(console.log)

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
