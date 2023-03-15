import { useSpacesStore } from "~/stores/spaces";
import { asDictionary, asNestedDictionary } from "../lib/collection-utils";

export default defineNuxtPlugin(async (app) => {
  const spacesStore = useSpacesStore(app.$pinia);
  const supabase = useSpacefinderSupabase();

  const buildingsOccupancy = await supabase.getBuildingsOccupancyCurrent();
  const activeDevicesPerBuilding = asDictionary(
    buildingsOccupancy ?? [],
    "building_number",
    "device_count"
  );

  spacesStore.bulkSetBuildingOccupancy(activeDevicesPerBuilding);
  supabase.subscribeToBuildingsOccupancy((buildingNumber, deviceCount) =>
    spacesStore.setBuildingOccupancy(buildingNumber, deviceCount)
  );

  /*const spacesOccupancy = await supabase.getSpacesOccupancyCurrent();
  const activeDevicesPerSpace = asNestedDictionary(
    spacesOccupancy ?? [],
    "building_number",
    "room_id",
    "device_count"
  );
  spacesStore.bulkSetSpaceOccupancy(activeDevicesPerSpace);
  supabase.subscribeToSpacesOccupancy((buildingNumber, roomId, deviceCount) =>
    spacesStore.setSpaceOccupancy(buildingNumber, roomId, deviceCount)
  );*/
});
