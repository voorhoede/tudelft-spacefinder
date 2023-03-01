import { defineStore } from "pinia";

export const useHistoryStore = defineStore("history", () => {
  const routes = ref<Array<{ fullPath: string; name: string }>>([]);

  function addRoute(route: {
    fullPath: string;
    name: string | Symbol | null | undefined;
  }) {
    const { fullPath, name } = route;
    routes.value.push({ fullPath, name: (name ?? "").toString() });
  }

  function goBack() {
    routes.value.pop();
    window.history.back();
  }

  const previousPageUrl = computed(() => {
    if (routes.value.length <= 1) return;
    return routes.value[routes.value.length - 2].fullPath;
  });

  return { addRoute, goBack, previousPageUrl };
});
