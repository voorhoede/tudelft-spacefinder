import { useStore } from "~/stores/store";

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const store = useStore();

  if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered)
    return; // Store has been set up on server
  if (to.params.spaceSlug) {
    const space = store.getSpaceBySlug(to.params.spaceSlug as string);
    if (!space)
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
        fatal: true,
      });
    store.selectSpace(space.building, space);
  } else if (to.params.buildingSlug) {
    const building = store.getBuildingBySlug(to.params.buildingSlug as string);
    if (!building)
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
        fatal: true,
      });
    store.selectBuilding(building);
  } else store.clearSelection();
});
