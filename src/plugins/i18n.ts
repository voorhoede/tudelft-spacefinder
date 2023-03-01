import en from "../data/en/messages.json";
import nl from "../data/nl/messages.json";
const messages: Record<string, Record<string, string>> = { en, nl }; //TODO: better typescript
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
    },
  };
});
