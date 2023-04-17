import type { Pinia } from "pinia";
import { useTimeoutPoll, useDocumentVisibility, refThrottled } from "@vueuse/core";
import { useSpacesStore } from "~/stores/spaces";
import { asDictionary } from "../lib/collection-utils";

export default defineNuxtPlugin(async (app) => {
  const spacesStore = useSpacesStore(app.$pinia as Pinia);
  const supabase = useSpacefinderSupabase();
  // prevent updating often due to switching tabs
  const documentVisibility = refThrottled(useDocumentVisibility(), 1000 * 60 * 2);

  const { pause, resume } = useTimeoutPoll(updateOccupancyData, 1000 * 60 * 5);

  watch(
    documentVisibility,
    (documentVisibilityState) => {
      if (documentVisibilityState === "visible") {
        resume();
      } else {
        pause();
      }
    },
    { immediate: true },
  );

  async function updateOccupancyData() {
    const buildingsOccupancy = await supabase.getBuildingsOccupancyCurrent();
    const activeDevicesPerBuilding = asDictionary(
      buildingsOccupancy ?? [],
      "building_number",
      "device_count"
    );

    spacesStore.bulkSetBuildingOccupancy(activeDevicesPerBuilding);

    const roomOccupancy = await supabase.getSpacesOccupancyCurrent();
    const activeDevicesPerRoom = asDictionary(
      roomOccupancy ?? [],
      "room_id",
      "device_count"
    );
    spacesStore.bulkSetRoomOccupancy(activeDevicesPerRoom);
  }
});
