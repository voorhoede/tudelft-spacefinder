import { useSpacesStore } from "~/stores/store";
export default defineNuxtPlugin(async (app) => {
  const spacesStore = useSpacesStore(app.$pinia);
  const supabase = useSpacefinderSupabase();
  const activeDevicesPerBuilding =
    await supabase.getBuildingsOccupancyCurrent();
  spacesStore.bulkSetBuildingOccupancy(activeDevicesPerBuilding);
  supabase.subscribeToBuildingsOccupancy((buildingNumber, deviceCount) =>
    spacesStore.setBuildingOccupancy(buildingNumber, deviceCount)
  );
});
