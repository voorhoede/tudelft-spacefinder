import { stringify } from 'jsr:@std/csv/stringify';

const query = `
{
  allSpaces(first: 500, orderBy: spaceId_ASC) {
    building {
      number
    }
    spaceId
    name
    roomId
    roomName
    floor
    location {
      latitude
      longitude
    }
    remark
    seats
    quietness
    adjustableChairs
    daylit
    powerOutlets
    whiteBoard
    presentationScreen
    nearCoffeeMachine
    nearPrinter
    nearBathroom
    grouptables
    dockingStation
    computer
  }
}
`;

const data = await datocmsFetch({ query });

await Deno.writeTextFile(
  `spaces-${Intl.DateTimeFormat('en-CA').format()}.json`,
  JSON.stringify(data, null, 2),
);

const rows = data.allSpaces.map((space: Record<string, unknown>) => ({
  building: (space.building as Record<string, string>)?.number ?? '',
  spaceId: space.spaceId as string,
  name: space.name as string,
  roomId: space.roomId as string,
  roomName: space.roomName as string,
  floor: space.floor as string,
  latitude: (space.location as Record<string, number>)?.latitude?.toString() ??
    '',
  longitude:
    (space.location as Record<string, number>)?.longitude?.toString() ?? '',
  remark: (space.remark as string | null) ?? '',
  seats: (space.seats as number).toString(),
  quietness: space.quietness as string,
  adjustableChairs: (space.adjustableChairs as boolean | null)?.toString() ??
    '',
  daylit: (space.daylit as boolean | null)?.toString() ?? '',
  powerOutlets: (space.powerOutlets as boolean | null)?.toString() ?? '',
  whiteBoard: (space.whiteBoard as boolean | null)?.toString() ?? '',
  presentationScreen:
    (space.presentationScreen as boolean | null)?.toString() ?? '',
  nearCoffeeMachine: (space.nearCoffeeMachine as boolean | null)?.toString() ??
    '',
  nearPrinter: (space.nearPrinter as boolean | null)?.toString() ?? '',
  nearBathroom: (space.nearBathroom as boolean | null)?.toString() ?? '',
  grouptables: (space.grouptables as boolean | null)?.toString() ?? '',
  dockingStation: (space.dockingStation as boolean | null)?.toString() ?? '',
  computer: (space.computer as boolean | null)?.toString() ?? '',
}));

const csv = stringify(rows, {
  columns: [
    'building',
    'spaceId',
    'name',
    'roomId',
    'roomName',
    'floor',
    'latitude',
    'longitude',
    'remark',
    'seats',
    'quietness',
    'adjustableChairs',
    'daylit',
    'powerOutlets',
    'whiteBoard',
    'presentationScreen',
    'nearCoffeeMachine',
    'nearPrinter',
    'nearBathroom',
    'grouptables',
    'dockingStation',
    'computer',
  ],
});

await Deno.writeTextFile(
  `spaces-${Intl.DateTimeFormat('en-CA').format()}.csv`,
  csv,
);

function datocmsFetch({ query }: { query: string }) {
  return fetch('https://graphql.datocms.com/', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Deno.env.get('DATO_API_TOKEN')!,
      'X-Exclude-Invalid': 'true',
    },
    body: JSON.stringify({
      query,
    }),
  })
    .then((response) => response.json())
    .then((result) => result.data);
}
