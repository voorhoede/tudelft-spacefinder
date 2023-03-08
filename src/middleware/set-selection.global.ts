import { useSpacesStore } from "~/stores/store";

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const spacesStore = useSpacesStore();
  if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered)
    return; // Store has been set up on server
  if (to.params.spaceSlug) {
    spacesStore.currentSelection = {
      level: "space",
      spaceSlug: to.params.spaceSlug as string,
    };
    if (!spacesStore.currentSpace) {
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
        fatal: true,
      });
    }
  } else if (to.params.buildingSlug) {
    spacesStore.currentSelection = {
      level: "building",
      buildingSlug: to.params.buildingSlug as string,
    };
    if (!spacesStore.currentBuilding)
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
        fatal: true,
      });
  } else spacesStore.currentSelection = undefined;
});
