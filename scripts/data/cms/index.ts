import * as dotenv from "dotenv";
dotenv.config();
import got from "got";
const { DATO_API_TOKEN } = process.env;
const mockDataEnabled = process.env.USE_MOCK_DATA_CMS === "1";

async function getFromDato(query: string, rootProp: string) {
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

export function getBuildingsDataFromCms() {
  if (mockDataEnabled) {
    console.info("Serving mock data from mock/cms/data.json");
    return import("../../../mock/cms/data.json").then((data) => data.default);
  }
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

export function getInfoDataFromCms() {
  if (mockDataEnabled) {
    return import("../../../mock/cms/info.json").then((info) => info.default);
  }
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

export function getFeedbackPageFromCms() {
  if (mockDataEnabled) {
    return import("../../../mock/cms/info.json").then((info) => info.default);
  }
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

export function getOnboardingDataFromCms() {
  if (mockDataEnabled) {
    return import("../../../mock/cms/info.json").then((info) => info.default);
  }
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

interface DatoLocalizedContent {
  locale: "nl" | "en";
  value: string;
}

interface DatoInfoPage {
  _allTitleLocales: DatoLocalizedContent[];
  _allBodyLocales: DatoLocalizedContent[];
}

export function convertCmsInfo(info: DatoInfoPage) {
  return {
    nl: {
      title:
        info._allTitleLocales.find((item) => item.locale === "nl")?.value ?? "",
      body:
        info._allBodyLocales.find((item) => item.locale === "nl")?.value ?? "",
    },
    en: {
      title:
        info._allTitleLocales.find((item) => item.locale === "en")?.value ?? "",
      body:
        info._allBodyLocales.find((item) => item.locale === "en")?.value ?? "",
    },
  };
}
