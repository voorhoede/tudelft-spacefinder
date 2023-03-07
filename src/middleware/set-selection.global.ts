import { useStore } from "~/stores/store";

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const store = useStore();
  if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered)
    return; // Store has been set up on server
  if (to.params.spaceSlug) {
    store.currentSelection = {
      level: "space",
      spaceSlug: to.params.spaceSlug as string,
    };
    if (!store.currentSpace) {
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
        fatal: true,
      });
    }
  } else if (to.params.buildingSlug) {
    store.currentSelection = {
      level: "building",
      buildingSlug: to.params.buildingSlug as string,
    };
    if (!store.currentBuilding)
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
        fatal: true,
      });
  } else store.currentSelection = undefined;
});
