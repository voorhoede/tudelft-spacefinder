import { useHistoryStore } from "~/stores/history";

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const historyStore = useHistoryStore(nuxtApp.$pinia);
  historyStore.addRoute(to);
});
