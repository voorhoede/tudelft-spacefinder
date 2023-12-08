import type { Pinia } from "pinia";
import { useSpacesStore } from "~/stores/spaces";
import { loadBuildings, loadRooms, loadSpaces } from "~/data/load-data";

export default defineNuxtPlugin(async (app) => {
  const spacesStore = useSpacesStore(app.$pinia);
  await Promise.all([
    loadBuildings().then(spacesStore.setBuildings),
    loadRooms().then(spacesStore.setRooms),
    loadSpaces().then(spacesStore.setSpaces),
  ]);
});
