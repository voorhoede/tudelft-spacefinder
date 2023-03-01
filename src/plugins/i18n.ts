import en from "../data/en/messages.json";
import nl from "../data/nl/messages.json";
import onboarding from "../data/onboarding.json";
import infoPage from "../data/infopage.json";
import feedbackPage from "~/data/feedbackpage.json";

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

function localePath(path: string, params: Record<string, string>) {
  const segments = path.split("/");
  const shouldAddLocalePrefix =
    path.startsWith("/") && !segments.includes(":locale");
  const shouldAddTrailingSlash = !path.endsWith("/");
  let url = segments
    .map((segment) => {
      if (!segment) return "";
      if (segment.startsWith(":")) return params[segment.substring(1)] ?? "";
      return t(params["locale"], "routes." + segment); //TODO: separate dictionary and different default behavior for routes
    })
    .join("/");
  if (shouldAddLocalePrefix) url = `/${params["locale"]}${url}`;
  if (shouldAddTrailingSlash) url = `${url}/`;
  return url;
}

export default defineNuxtPlugin((nuxtApp) => {
  const locale = useState(() => "en");

  return {
    provide: {
      locale,
      t: (key: string, amount?: number) => t(locale.value, key, amount),
      localePath: (path: string, params?: Record<string, string>) =>
        localePath(path, { locale: locale.value, ...params }),
      pageContent: (key: string) => pageContent(locale.value, key),
    },
  };
});
