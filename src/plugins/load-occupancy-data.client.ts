import type { Pinia } from "pinia";
import { useSpacesStore } from "~/stores/spaces";
import { asDictionary } from "../lib/collection-utils";

export default defineNuxtPlugin(async (app) => {
  const spacesStore = useSpacesStore(app.$pinia as Pinia);
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

  const roomOccupancy = await supabase.getSpacesOccupancyCurrent();
  const activeDevicesPerRoom = asDictionary(
    roomOccupancy ?? [],
    "room_id",
    "device_count"
  );
  spacesStore.bulkSetRoomOccupancy(activeDevicesPerRoom);
  supabase.subscribeToSpacesOccupancy((realEstateNumber, deviceCount) =>
    spacesStore.setRoomOccupancy(realEstateNumber, deviceCount)
  );
});
