export default {
  spaces: [
    {
      spaceId: "sp1",
      floor: "ground floor",
      seats: 10,
      tables: 1,
      latitude: 50.5,
      longitude: 10.1,
      i18n: {
        en: { name: "corridor", slug: "sp1--hal" },
        nl: { name: "hal", slug: "sp1--hal" },
      },
      roomId: "r-1-1",
      facilities: {
        adjustableChairs: true,
        daylit: false,
        powerOutlets: true,
        ethernet: false,
        stationaryPC: true,
        whiteBoard: false,
        smartBoard: true,
        presentationScreen: false,
        nearCoffeeMachine: true,
        nearPrinter: false,
        nearBathroom: true,
        studyType: "group" as const,
        quietness: "quiet" as const,
      },
      buildingNumber: 31,
      exchangeBuildingId: "building@domain.com",
      exchangeRoomId: "room@domain.com",
    },
  ],
  availability: {
    "building@domain.com": [
      {
        StartTime: "2019-07-30T05:30:00",
        EndTime: "2019-07-30T16:00:00",
        BusyType: "Free",
      },
      {
        StartTime: "2019-07-31T05:30:00",
        EndTime: "2019-07-31T16:00:00",
        BusyType: "Free",
      },
      {
        StartTime: "2019-08-01T05:30:00",
        EndTime: "2019-08-01T16:00:00",
        BusyType: "Free",
      },
      {
        StartTime: "2019-08-02T05:30:00",
        EndTime: "2019-08-02T16:00:00",
        BusyType: "Free",
      },
      {
        StartTime: "2019-08-05T05:30:00",
        EndTime: "2019-08-05T16:00:00",
        BusyType: "Free",
      },
    ],
    "room@domain.com": [
      {
        StartTime: "2019-07-30T07:00:00",
        EndTime: "2019-07-30T08:00:00",
        BusyType: "Busy",
      },
      {
        StartTime: "2019-07-30T13:30:00",
        EndTime: "2019-07-30T14:00:00",
        BusyType: "Busy",
      },
      {
        StartTime: "2019-07-30T15:30:00",
        EndTime: "2019-07-30T15:45:00",
        BusyType: "Free",
      },
      {
        StartTime: "2019-07-31T09:00:00",
        EndTime: "2019-07-31T16:30:00",
        BusyType: "Busy",
      },
    ],
  },
};
