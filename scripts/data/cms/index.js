require('dotenv').config()
const got = require('got')
const { DATO_API_TOKEN } = process.env
const mockDataEnabled = process.env.USE_MOCK_DATA_CMS === '1'

const queryDato = query => got('https://graphql.datocms.com/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DATO_API_TOKEN}`,
  },
  json: true,
  body: { query },
}).then(({ body }) => body.data)

const getBuildings = () => queryDato(`{
  allBuildings() {
    image {
      url
    }
    number,
    bounds
  }
}`).then(data => data.allBuildings)

const getInfoPage = () => queryDato(`{
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
}`).then(data => data.infoPage)

const getOnboarding = () => queryDato(`{
  onboarding {
    _allTitleLocales {
      locale,
      value
    }
    _allBodyLocales {
      locale,
      value
    }
  }
}`).then(data => data.onboarding)

const convertCmsInfo = (info) => {
  return {
    nl: {
      title: info._allTitleLocales.find((item) => {
        return item.locale === 'nl'
      }).value,
      body: info._allBodyLocales.find((item) => {
        return item.locale === 'nl'
      }).value,
    },
    en: {
      title: info._allTitleLocales.find((item) => {
        return item.locale === 'en'
      }).value,
      body: info._allBodyLocales.find((item) => {
        return item.locale === 'en'
      }).value,
    },
  }
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
  getOnboardingDataFromCms: getOnboarding,
  convertCmsInfo,
}
