import { useStore } from "~/stores/store";
import Cookie from "js-cookie";

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const store = useStore(nuxtApp.$pinia);
  const i18n = nuxtApp.$i18n.global;
  if (
    to.params.locale &&
    typeof to.params.locale == "string" &&
    to.params.locale != i18n.locale.value
  ) {
    i18n.locale.value = to.params.locale;
    store.locale = to.params.locale;
    //TODO: cookie is now set in situations where user navigates via URL (wasn't the case before). Is that OK?
    Cookie.set("nf_lang", to.params.locale);
  }
});
