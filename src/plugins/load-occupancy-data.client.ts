import { useSpacesStore } from "~/stores/spaces";
export default defineNuxtPlugin(async (app) => {
  const spacesStore = useSpacesStore(app.$pinia);
  const supabase = useSpacefinderSupabase();

  const activeDevicesPerBuilding =
    await supabase.getBuildingsOccupancyCurrent();
  spacesStore.bulkSetBuildingOccupancy(activeDevicesPerBuilding);
  supabase.subscribeToBuildingsOccupancy((buildingNumber, deviceCount) =>
    spacesStore.setBuildingOccupancy(buildingNumber, deviceCount)
  );

  const activeDevicesPerSpace = await supabase.getSpacesOccupancyCurrent();
  console.log(activeDevicesPerSpace);
  spacesStore.bulkSetSpaceOccupancy(activeDevicesPerSpace);
  supabase.subscribeToSpacesOccupancy((buildingNumber, roomId, deviceCount) =>
    spacesStore.setSpaceOccupancy(buildingNumber, roomId, deviceCount)
  );
});
