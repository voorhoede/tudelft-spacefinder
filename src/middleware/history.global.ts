import { useHistoryStore } from "~/stores/history";
import { useStore } from "~/stores/store";

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const historyStore = useHistoryStore(nuxtApp.$pinia);
  const store = useStore(nuxtApp.$pinia);
  historyStore.addRoute(to);
  const i18n = nuxtApp.$i18n.global;
  if (
    to.params.locale &&
    typeof to.params.locale == "string" &&
    to.params.locale != i18n.locale.value
  ) {
    i18n.locale.value = to.params.locale;
    store.locale = to.params.locale;
  }
});
