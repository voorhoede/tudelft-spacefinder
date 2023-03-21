import en from "../data/en/messages.json";
import nl from "../data/nl/messages.json";
import onboarding from "../data/onboarding.json";
import infoPage from "../data/infopage.json";
import feedbackPage from "~/data/feedbackpage.json";
import type { Building } from "../types/Building";
import type { Space } from "../types/Space";
import type { Room } from "../types/Room";

const messages: Record<string, Record<string, string>> = { en, nl }; //TODO: better typescript
const content: Record<string, Record<string, string>> = {};
for (const locale of ["en", "nl"] as const) {
  content[locale] = {};
  for (const prop of ["title", "body"] as const)
    content[locale][`onboarding.${prop}`] = onboarding[locale][prop];
  for (const prop of ["title", "body"] as const)
    content[locale][`infoPage.${prop}`] = infoPage[locale][prop];
  for (const prop of ["title", "body"] as const)
    content[locale][`feedbackPage.${prop}`] = feedbackPage[locale][prop];
}

function t(locale: string, key: string, amount?: number) {
  const localMessages = messages[locale];
  if (!localMessages) return key;
  if (amount == undefined) return localMessages[key] ?? key;
  const messageCases = localMessages[key].split("|").map((p) => p.trim());
  const partIndex = amount == 0 ? 0 : amount == 1 ? 1 : 2;
  const messageCase = messageCases[partIndex];
  if (messageCase == undefined) return key;
  return messageCase.replace(/\{amount\}/g, amount.toString());
}

function pageContent(locale: string, key: string) {
  const localContent = content[locale];
  if (!localContent) return key;
  return localContent[key] ?? key;
}

export type PathParams = {
  building?: Building;
  space?: Space | Room;
  locale: string;
  buildingSlug?: string;
  spaceSlug?: string;
};

function hasOwnProperty<X extends {}>(
  obj: X,
  prop: string
): obj is X & Record<string, unknown> {
  return obj.hasOwnProperty(prop);
}

function localePath(path: string, params: PathParams) {
  const segments = path.split("/");
  const shouldAddLocalePrefix =
    path.startsWith("/") && !segments.includes(":locale");
  const shouldAddTrailingSlash = !path.endsWith("/");
  let url = segments
    .map((segment) => {
      if (!segment) return "";
      if (segment.startsWith(":")) {
        const paramKey = segment.substring(1);
        if (hasOwnProperty(params, paramKey)) {
          const param = params[paramKey];
          if (typeof param === "string") return param;
        }
        return "";
      }
      return t(params["locale"], "routes." + segment); //TODO: separate dictionary and different default behavior for routes
    })
    .join("/");
  if (shouldAddLocalePrefix) url = `/${params["locale"]}${url}`;
  if (shouldAddTrailingSlash) url = `${url}/`;
  return url;
}

function normalizePathParams(
  params: Partial<PathParams> | undefined,
  locale: string
) {
  const result = { locale, ...params } as PathParams;
  if (!result.buildingSlug) {
    const building = result.building || result.space?.building;
    if (building) result.buildingSlug = building.i18n[result.locale].slug;
  }
  if (!result.spaceSlug && result.space) {
    const i18n = result.space.i18n[result.locale];
    if ("slug" in i18n) result.spaceSlug = i18n.slug;
    else result.spaceSlug = (result.space as Room).slug;
  }
  return result;
}

export default defineNuxtPlugin(() => {
  const locale = useState(() => "en");

  return {
    provide: {
      locale,
      t: (key: string, amount?: number) => t(locale.value, key, amount),
      localePath: (path: string, params?: Partial<PathParams>) =>
        localePath(path, normalizePathParams(params, locale.value)),
      pageContent: (key: string) => pageContent(locale.value, key),
    },
  };
});
