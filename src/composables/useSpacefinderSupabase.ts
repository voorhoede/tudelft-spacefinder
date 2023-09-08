import type { Database } from "../types/supabase";

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

  async function getSpacesOccupancyCurrent() {
    const { data } = await client
      .from("spaces_latest_states")
      .select("*")
      .gte("updated_at", getEarliestTimeConsidered());
    return data;
  }

  function getBuildings() {
    return client
      .from("buildings")
      .select("number, opening_hours")
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase buildings fetch", error);
        }

        return data;
      });
  }

  return {
    getBuildingsOccupancyCurrent,
    getSpacesOccupancyCurrent,
    getBuildings,
  };
}
