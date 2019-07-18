require('dotenv').config()
const got = require('got')
const { DATO_API_TOKEN } = process.env

const getBuildings = () => got('https://graphql.datocms.com/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DATO_API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: '{"query":"{allBuildings() {image {url}number,bounds}}","variables":null}'
})

module.exports = () => getBuildings()
  .then(({ body }) => {
    return JSON.parse(body)
  })
  .then(({ data: { allBuildings } }) => allBuildings)
