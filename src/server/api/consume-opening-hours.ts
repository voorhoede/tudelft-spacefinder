import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';
import { serverSupabaseServiceRole } from '#supabase/server';

const { internalSecret, datoApiToken, microsoftGraph } = useRuntimeConfig();

const credential = new ClientSecretCredential(
  microsoftGraph.tenantId,
  microsoftGraph.clientId,
  microsoftGraph.clientSecret,
);

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default'],
});

const graphClient = Client.initWithMiddleware({
  authProvider: authProvider,
  fetchOptions: {
    headers: { 'Prefer': 'outlook.timezone="Europe/Amsterdam"' },
  },
});

export default defineEventHandler(async (event) => {
  if (getQuery(event)?.secret !== internalSecret) {
    event.node.res.statusCode = 401;
    event.node.res.end();
    return;
  }

  const client = serverSupabaseServiceRole(event);

  const { data } = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      Authorization: datoApiToken,
    },
    body: JSON.stringify({
      query: `
        {
          allBuildings(first: 100) {
            number
          }
        }
      `,
    }),
  }).then((response) => response.json());

  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setUTCHours(12, 0, 0, 0);
  endDate.setUTCDate(startDate.getUTCDate() + 7);

  type Building = {
    number: string;
  };

  type BuildingOpeningDates = Building & {
    openEvents: Array<{
      start: string;
      end: string;
    }>;
  };

  type CalendarEvent = {
    subject: string;
    start: { dateTime: string }
    end: { dateTime: string }
  };

  const buildingsOpeningDates: BuildingOpeningDates[] = await Promise.all(
    data.allBuildings.map((building: Building) =>
      graphClient
        .api(
          `/users/building-${
            building.number
          }@tudelft.nl/calendar/calendarView?startDateTime=${
            startDate.toISOString()
          }&endDateTime=${
            endDate.toISOString()
          }&$select=subject,start,end`
        )
        .get()
        .then((calendarView) => ({
          number: building.number,
          openEvents: calendarView.value
            .filter((event: CalendarEvent) => event.subject === 'Open')
            .map((event: CalendarEvent) => ({
              start: new Date(event.start.dateTime).toISOString(),
              end: new Date(event.end.dateTime).toISOString(),
            })),
        }))
        .catch((error) => {
          console.warn(
            `Failed to fetch data for building ${building.number}:`,
            error.body,
          );

          return {
            number: building.number,
            openEvents: [],
          };
        }),
    ),
  );

  const { error } = await client.from('buildings').upsert(
    // @ts-expect-error
    buildingsOpeningDates.map((building) => ({
      number: building.number,
      opening_hours: building.openEvents,
    })),
  );

  if (error) {
    console.error('Failed to upsert buildings to Supabase', error);
    event.node.res.statusCode = 503;
    return event.node.res.end();
  }

  event.node.res.statusCode = 202;
  event.node.res.end();
});
