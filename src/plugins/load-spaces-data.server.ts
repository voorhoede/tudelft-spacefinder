import type { Pinia } from "pinia";
import { useSpacesStore } from "~/stores/spaces";

export default defineNuxtPlugin((app) => {
  const spacesStore = useSpacesStore(app.$pinia as Pinia); //https://github.com/vuejs/pinia/issues/2071
  import("~/data/buildings.json").then((buildings) => {
    spacesStore.setBuildings(buildings.default as any);
  });
  import("~/data/rooms.json").then((rooms) => {
    spacesStore.setRooms(rooms.default as any);
  });
  import("~/data/spaces.json").then((spaces) => {
    spacesStore.setSpaces(spaces.default as any);
  });
});
