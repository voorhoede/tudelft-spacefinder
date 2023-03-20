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

export function getPageFromCms(pageName: string): Promise<DatoInfoPage> {
  if (mockDataEnabled)
    return import("../../../mock/cms/info.json").then((info) => info.default);

  return getFromDato(
    `{
      ${pageName} {
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
    pageName
  );
}

export interface DatoLocalizedContent {
  locale: string;
  value: string;
}

export interface DatoInfoPage {
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
