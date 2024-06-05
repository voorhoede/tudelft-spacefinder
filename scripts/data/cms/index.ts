import { datocmsEnvironment } from "../../../src/constants";

async function getFromDato(query: string, rootProp: string) {
  return fetch("https://graphql.datocms.com/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DATO_API_TOKEN}`,
      "X-Environment": datocmsEnvironment,
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .then(({ data }) => data[rootProp]);
}

export function getBuildingsDataFromCms() {
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
            roomName
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
            remarkEN: remark(locale: en)
            remarkNL: remark(locale: nl)
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
            grouptables
            computer
            dockingStation
          }
        }
      }
    `,
    "allBuildings"
  );
}

export function getPageFromCms(pageName: string): Promise<DatoInfoPage> {
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
