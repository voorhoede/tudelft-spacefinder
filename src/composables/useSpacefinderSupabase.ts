import { asDictionary, asNestedDictionary } from "../lib/collection-utils";
import { Database } from "../types/supabase";

export default function useSpacefinderSupabase() {
  const client = useSupabaseClient<Database>();

  async function getBuildingsOccupancyCurrent() {
    return (await client.from("buildings_latest_states").select("*")).data;
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
    return (await client.from("spaces_latest_states").select("*")).data;
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
