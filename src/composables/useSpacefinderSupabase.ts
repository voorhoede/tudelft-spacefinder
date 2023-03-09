import { Database } from "../types/supabase";

export default function useSpacefinderSupabase() {
  const client = useSupabaseClient<Database>();

  async function getBuildingsOccupancyCurrent() {
    const { data, error, status } = await client
      .from("buildings_latest_states")
      .select("*");
    const activeDevicesPerBuilding: Record<number, number> = {};
    if (data) {
      for (const row of data)
        activeDevicesPerBuilding[row.building_number] = row.device_count;
    }
    return activeDevicesPerBuilding;
  }

  function subscribeToBuildingsOccupancy(
    callback: (buildingNumber: number, deviceCount: number) => void
  ) {
    const buildingsRealtimeChannel = client
      .channel("buildings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buildings_latest_states" },
        ({ eventType, new: newData, old }) => {
          if (eventType == "UPDATE" || eventType == "INSERT") {
            callback(newData.building_number, newData.device_count);
          } else {
            callback(old.building_number, 0);
          }
        }
      );
    buildingsRealtimeChannel.subscribe();
  }

  async function getSpacesOccupancyCurrent() {
    const { data, error, status } = await client
      .from("spaces_latest_states")
      .select("*");
    const activeDevicesPerBuildingAndSpace: Record<
      number,
      Record<string, number>
    > = {};
    if (data) {
      for (const row of data) {
        if (!activeDevicesPerBuildingAndSpace[row.building_number])
          activeDevicesPerBuildingAndSpace[row.building_number] = {};
        activeDevicesPerBuildingAndSpace[row.building_number][row.room_id] =
          row.device_count;
      }
    }
    return activeDevicesPerBuildingAndSpace;
  }

  function subscribeToSpacesOccupancy(
    callback: (
      buildingNumber: number,
      roomId: string,
      deviceCount: number
    ) => void
  ) {
    const spacesRealtimeChannel = client
      .channel("spaces")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "spaces_latest_states" },
        ({ eventType, new: newData, old }) => {
          if (eventType == "UPDATE" || eventType == "INSERT") {
            callback(
              newData.building_number,
              newData.room_id,
              newData.device_count
            );
          } else {
            callback(old.building_number, old.room_id, 0);
          }
        }
      );
    spacesRealtimeChannel.subscribe();
  }

  return {
    getBuildingsOccupancyCurrent,
    subscribeToBuildingsOccupancy,
    getSpacesOccupancyCurrent,
    subscribeToSpacesOccupancy,
  };
}
