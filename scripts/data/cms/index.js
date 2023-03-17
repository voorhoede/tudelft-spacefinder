require("dotenv").config();
const got = require("got");
const { DATO_API_TOKEN } = process.env;
const mockDataEnabled = process.env.USE_MOCK_DATA_CMS === "1";

async function getFromDato(query, rootProp) {
  const response = await got("https://graphql.datocms.com/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DATO_API_TOKEN}`,
    },
    json: true,
    body: {
      query,
      variables: null,
    },
  });
  return response.body.data[rootProp];
}

function getBuildings() {
  return getFromDato(
    `{
      allBuildings {
        image {
          url
        }
        number,
        bounds
      }
    }`,
    "allBuildings"
  );
}

function getInfoPage() {
  return getFromDato(
    `{
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
    "infoPage"
  );
}

function getFeedbackPage() {
  return getFromDato(
    `{
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
    "feedbackPage"
  );
}

function getOnboarding() {
  return getFromDato(
    `{
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
    "onboarding"
  );
}

function convertCmsInfo(info) {
  return {
    nl: {
      title: info._allTitleLocales.find((item) => item.locale === "nl").value,
      body: info._allBodyLocales.find((item) => item.locale === "nl").value,
    },
    en: {
      title: info._allTitleLocales.find((item) => item.locale === "en").value,
      body: info._allBodyLocales.find((item) => item.locale === "en").value,
    },
  };
}

module.exports = {
  getBuildingsDataFromCms: () => {
    if (mockDataEnabled) {
      console.info("Serving mock data from mock/cms/data.json");
      const mockData = require("../../../mock/cms/data.json");
      return Promise.resolve(mockData);
    }
    return getBuildings();
  },
  getInfoDataFromCms: () => {
    if (mockDataEnabled) {
      const mockData = require("../../../mock/cms/info.json");
      return Promise.resolve(mockData);
    }
    return getInfoPage();
  },
  getFeedbackPageFromCms: () => {
    if (mockDataEnabled) {
      const mockData = require("../../../mock/cms/info.json");
      return Promise.resolve(mockData);
    }
    return getFeedbackPage();
  },
  getOnboardingDataFromCms: () => {
    if (mockDataEnabled) {
      const mockData = require("../../../mock/cms/info.json");
      return Promise.resolve(mockData);
    }
    return getOnboarding();
  },
  convertCmsInfo,
};
