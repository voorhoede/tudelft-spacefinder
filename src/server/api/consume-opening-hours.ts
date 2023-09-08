import { getRoomAvailability } from "../helpers/room-availability";
import { roomstoTimes } from "../helpers/rooms-to-times";
import { buildingOpeningHours } from "../helpers/opening-hours";
import { serverSupabaseServiceRole } from "#supabase/server";

const { internalSecret, datoApiToken } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  if (getQuery(event)?.secret !== internalSecret) {
    event.node.res.statusCode = 401;
    event.node.res.end();
    return;
  }

  const client = serverSupabaseServiceRole(event);

  const emails = await fetch(
    "https://graphql.datocms.com/",
    {
      method: "POST",
      headers: {
        Authorization: datoApiToken,
      },
      body: JSON.stringify({ query: `
        {
          allBuildings(first: 100) {
            number
          }
        }
      `}),
    }
  )
    .then((response) => response.json())
    .then(({ data }) => data.allBuildings.map(buildingNumberToEmail));

  const roomAvailability = await getRoomAvailability(emails);
  const times = roomstoTimes(emails, roomAvailability);
  const buildingOpeningHoursResult = buildingOpeningHours(times);

  const { error } = await client
    .from("buildings")
    .upsert(
      buildingOpeningHoursResult.map((building) => ({
        number: building.exchangeBuildingId.replace(/\D/g, ""),
        opening_hours: building.openingHours,
      }))
    );

  if (error) {
    console.error("Failed to upsert buildings to Supabase", error);
  }

  event.node.res.statusCode = 202;
  event.node.res.end();
});

function buildingNumberToEmail({ number }: { number: number }) {
  return `Building-${String(number).padStart(2, "0")}@tudelft.nl`;
}
