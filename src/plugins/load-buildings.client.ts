import { useSpacesStore } from "~/stores/spaces";
import type { Pinia } from "pinia";

export default defineNuxtPlugin(({ $pinia }) => {
  const spacesStore = useSpacesStore($pinia as Pinia);
  const spacefinderSupabase = useSpacefinderSupabase();

  spacefinderSupabase
    .getBuildings()
    .then(spacesStore.bulkSetBuildingOpeningHours);
});
