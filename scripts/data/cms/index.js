require('dotenv').config()
const got = require('got')
const { DATO_API_TOKEN } = process.env

require('dotenv').config()

const mockDataEnabled = process.env.USE_MOCK_DATA === '1'

const getBuildings = () => got('https://graphql.datocms.com/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DATO_API_TOKEN}`
  },
  json: true,
  body: {
    query: `{
      allBuildings() {
        image {
          url
        }
        number,
        bounds
      }
    }`,
    variables: null
  }
}).then(({ body: { data: { allBuildings } } }) => {
  return allBuildings
})

module.exports = () => {
  if (mockDataEnabled) {
    console.log('Serving mock data from mock/cms/data.json')
    const mockData = require('../../../mock/cms/data.json')
    return Promise.resolve(mockData)
  }
  return getBuildings()
}
