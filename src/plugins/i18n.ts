import { createI18n } from "vue-i18n";
import en from "../public/data/en/messages.json";
import nl from "../public/data/nl/messages.json";

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "en",
    messages: {
      en,
      nl,
    },
  });

  nuxtApp.vueApp.use(i18n);
  nuxtApp.$i18n = i18n;
});
