import { useStore } from "~/stores/store";

export default defineNuxtPlugin((app) => {
  const store = useStore(app.$pinia);
  import("~/data/buildings.json").then((buildings) => {
    store.setBuildings(buildings.default as any); //TODO: arrays can't become tuples, silly things
  });
  import("~/data/spaces.json").then((spaces) => {
    store.setSpaces(spaces.default as any); //TODO: arrays can't become tuples, silly things
  });
});
