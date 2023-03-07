import { useStore } from "~/stores/store";
export default defineNuxtPlugin(async (app) => {
  const store = useStore(app.$pinia);
  const supabase = useSpacefinderSupabase();
  const activeDevicesPerBuilding =
    await supabase.getBuildingsOccupancyCurrent();
  store.bulkSetBuildingOccupancy(activeDevicesPerBuilding);
  supabase.subscribeToBuildingsOccupancy((buildingNumber, deviceCount) =>
    store.setBuildingOccupancy(buildingNumber, deviceCount)
  );
});
