import { Database } from "../types/supabase";

export default function useSpacefinderSupabase() {
  const client = useSupabaseClient<Database>();

  function getEarliestTimeConsidered() {
    const outdateInMinutes = 30;
    return new Date(
      new Date().getTime() - outdateInMinutes * 60 * 1000
    ).toISOString();
  }

  async function getBuildingsOccupancyCurrent() {
    const { data } = await client
      .from("buildings_latest_states")
      .select("*")
      .gte("updated_at", getEarliestTimeConsidered());
    return data;
  }

  function subscribeToBuildingsOccupancy(
    callback: (buildingNumber: number, deviceCount: number | undefined) => void
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
            callback(old.building_number, undefined);
          }
        }
      );
    buildingsRealtimeChannel.subscribe();
  }

  async function getSpacesOccupancyCurrent() {
    const { data } = await client
      .from("spaces_latest_states")
      .select("*")
      .gte("updated_at", getEarliestTimeConsidered());
    return data;
  }

  function subscribeToSpacesOccupancy(
    callback: (
      realEstateNumber: string,
      deviceCount: number | undefined
    ) => void
  ) {
    const spacesRealtimeChannel = client
      .channel("spaces")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "spaces_latest_states" },
        ({ eventType, new: newData, old }) => {
          if (eventType == "UPDATE" || eventType == "INSERT") {
            callback(newData.room_id, newData.device_count);
          } else {
            callback(old.room_id, undefined);
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
