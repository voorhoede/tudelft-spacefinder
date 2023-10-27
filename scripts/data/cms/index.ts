import { datocmsEnvironment } from "../../../src/constants";
import * as dotenv from "dotenv";
dotenv.config();
const { DATO_API_TOKEN } = process.env;
const mockDataEnabled = process.env.USE_MOCK_DATA_CMS === "1";

async function getFromDato(query: string, rootProp: string) {
  return fetch("https://graphql.datocms.com/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DATO_API_TOKEN}`,
      "X-Environment": datocmsEnvironment,
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .then(({ data }) => data[rootProp]);
}

export function getBuildingsDataFromCms() {
  if (mockDataEnabled) {
    console.info("Serving mock data from mock/cms/data.json");
    return import("../../../mock/cms/buildings.json").then((data) => data.default);
  }
  return getFromDato(
    `
      {
        allBuildings(first: 100) {
          number
          nameEN: name(locale: en)
          nameNL: name(locale: nl)
          abbreviationEN: abbreviation(locale: en)
          abbreviationNL: abbreviation(locale: nl)
          occupancyLimit
          bounds
          image {
            url
          }
          spaces: _allReferencingSpaces(first: 100) {
            spaceId
            roomId
            nameEN: name(locale: en)
            nameNL: name(locale: nl)
            floor
            location {
              latitude
              longitude
            }
            image {
              url
            }
            seats
            quietness
            adjustableChairs
            daylit
            powerOutlets
            whiteBoard
            presentationScreen
            nearCoffeeMachine
            nearPrinter
            nearBathroom
          }
        }
      }
    `,
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

export function getNotificationFromCms(): Promise<DatoNotification> {
  if (mockDataEnabled)
    return import("../../../mock/cms/notification.json").then((info) => info.default);

  return getFromDato(
    `{
      notification {
        showNotification
        updatedAt
        _allBodyLocales {
          locale,
          value
        }
      }
    }`,
    'notification'
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

export interface DatoNotification {
  showNotification: boolean;
  updatedAt: string;
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

export function convertCmsNotification(info: DatoNotification) {
  return {
    showNotification: info.showNotification,
    updatedAt: info.updatedAt,
    nl: {
      body:
        info._allBodyLocales.find((item) => item.locale === "nl")?.value ?? "",
    },
    en: {
      body:
        info._allBodyLocales.find((item) => item.locale === "en")?.value ?? "",
    },
  }
}
