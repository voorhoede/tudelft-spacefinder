import { useSpacesStore } from "~/stores/store";

export default defineNuxtPlugin((app) => {
  const spacesStore = useSpacesStore(app.$pinia);
  import("~/data/buildings.json").then((buildings) => {
    spacesStore.setBuildings(buildings.default as any); //TODO: arrays can't become tuples, silly things
  });
  import("~/data/spaces.json").then((spaces) => {
    spacesStore.setSpaces(spaces.default as any); //TODO: arrays can't become tuples, silly things
  });
});
