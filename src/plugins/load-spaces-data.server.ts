import type { Pinia } from "pinia";
import { useSpacesStore } from "~/stores/spaces";
import { loadBuildings, loadRooms, loadSpaces } from "~/data/load-data";

export default defineNuxtPlugin(async (app) => {
  const spacesStore = useSpacesStore(app.$pinia as Pinia); //https://github.com/vuejs/pinia/issues/2071
  await Promise.all([
    loadBuildings().then(spacesStore.setBuildings),
    loadRooms().then(spacesStore.setRooms),
    loadSpaces().then(spacesStore.setSpaces),
  ]);
});
