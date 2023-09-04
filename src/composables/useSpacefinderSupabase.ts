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
    console.time('getBuildingsOccupancyCurrent');
    const { data } = await client
      .from("buildings_latest_states")
      .select("*")
      .gte("updated_at", getEarliestTimeConsidered());
    console.timeEnd('getBuildingsOccupancyCurrent');
    return data;
  }

  async function getSpacesOccupancyCurrent() {
    console.time('getSpacesOccupancyCurrent')
    const { data } = await client
      .from("spaces_latest_states")
      .select("*")
      .gte("updated_at", getEarliestTimeConsidered());
    console.timeEnd('getSpacesOccupancyCurrent')
    return data;
  }

  return {
    getBuildingsOccupancyCurrent,
    getSpacesOccupancyCurrent,
  };
}
