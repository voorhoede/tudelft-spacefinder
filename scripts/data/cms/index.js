require('dotenv').config()
const got = require('got')
const { DATO_API_TOKEN } = process.env
const mockDataEnabled = process.env.USE_MOCK_DATA_CMS === '1'

const getBuildings = () => got('https://graphql.datocms.com/', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${DATO_API_TOKEN}`,
  },
  json: true,
  body: {
    query: `{
      allBuildings {
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
    Authorization: `Bearer ${DATO_API_TOKEN}`,
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

const getFeedbackPage = () => got('https://graphql.datocms.com/', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${DATO_API_TOKEN}`,
  },
  json: true,
  body: {
    query: `{
      feedbackPage {
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
}).then(({ body: { data: { feedbackPage } } }) => {
  return feedbackPage
})

const getOnboarding = () => got('https://graphql.datocms.com/', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${DATO_API_TOKEN}`,
  },
  json: true,
  body: {
    query: `{
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
    }`,
    variables: null,
  },
}).then(({ body: { data: { onboarding } } }) => {
  return onboarding
})

const convertCmsInfo = (info) => {
  const infoPage = {
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
  getInfoDataFromCms: ()=>{ 
    if (mockDataEnabled) {
      const mockData = require('../../../mock/cms/info.json')
      return Promise.resolve(mockData)
    }
    return getInfoPage()
  },
  getFeedbackPageFromCms: ()=>{
    if (mockDataEnabled) {
      const mockData = require('../../../mock/cms/info.json')
      return Promise.resolve(mockData)
    }
    return getFeedbackPage()
  },
  getOnboardingDataFromCms: ()=> {
    if (mockDataEnabled) {
      const mockData = require('../../../mock/cms/info.json')
      return Promise.resolve(mockData)
    }
    return getOnboarding()
  },
  convertCmsInfo,
}
