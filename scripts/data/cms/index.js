require('dotenv').config()
const got = require('got')
const { DATO_API_TOKEN } = process.env
const mockDataEnabled = process.env.USE_MOCK_DATA_CMS === '1'

const getBuildings = () => got('https://graphql.datocms.com/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DATO_API_TOKEN}`,
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
    variables: null,
  },
}).then(({ body: { data: { allBuildings } } }) => {
  return allBuildings
})

const getInfoPage = () => got('https://graphql.datocms.com/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DATO_API_TOKEN}`,
  },
  json: true,
  body: {
    query: `{
      infoPage {
        _allTitleLocales {
          locale,
          value
        }
        _allBodyLocales {
          locale,
          value
        }
      }
    }`,
    variables: null,
  },
}).then(({ body: { data: { infoPage } } }) => {
  return infoPage
})

const convertInfoPage = (info) => {
  const infoPage = [
    {
      en: {
        title: info._allTitleLocales.find((item) => {
          return item.locale === 'en'
        }).value,
        body: info._allBodyLocales.find((item) => {
          return item.locale === 'en'
        }).value,
      },
    },
    {
      nl: {
        title: info._allTitleLocales.find((item) => {
          return item.locale === 'en'
        }).value,
        body: info._allBodyLocales.find((item) => {
          return item.locale === 'en'
        }).value,
      },
    },
  ]

  return infoPage
}

module.exports = {
  getBuildingsDataFromCms: () => {
    if (mockDataEnabled) {
      console.info('Serving mock data from mock/cms/data.json')
      const mockData = require('../../../mock/cms/data.json')
      return Promise.resolve(mockData)
    }
    return getBuildings()
  },
  getInfoDataFromCms: getInfoPage,
  convertInfoPage,
}
