import { getSpaceI18n, getSpaces } from "./transform-spaces.mjs";

describe("Space i18n properties transformation", () => {
  it("works", () => {
    expect(getSpaceI18n("SSP00001", "GANG")).toEqual({
      name: "GANG",
      slug: "ssp00001--gang",
    });
  });

  it("trims", () => {
    expect(getSpaceI18n(" SSP00001  ", "  GANG ")).toEqual({
      name: "GANG",
      slug: "ssp00001--gang",
    });
  });
});

describe("Space transformation", () => {
  it("works", () => {
    expect(
      getSpaces([
        {
          buildingId: "34 - 3mE",
          spaceNameNL: "GANG",
          spaceNameEN: "Study Spot",
          spaceId: "SSP00001",
          floor: "1e verdieping",
          seats: 72,
          tables: 9,
          exchangeBuildingId: "Building-34@tudelft.nl",
          exchangeRoomId: "",
          latitude: 52.001591,
          longitude: 4.371567,
          roomId: "C-1-801",
          adjustableChairs: false,
          studyType: "group",
          quietness: "quiet",
          daylit: true,
          powerOutlets: true,
          ethernet: true,
          stationaryPC: false,
          whiteBoard: true,
          smartBoard: false,
          presentationScreen: false,
          nearCoffeeMachine: false,
          nearPrinter: false,
          nearBathroom: true,
        },
      ])
    ).toEqual([
      {
        buildingNumber: 34,
        i18n: {
          nl: {
            name: "GANG",
            slug: "ssp00001--gang",
          },
          en: {
            name: "Study Spot",
            slug: "ssp00001--study-spot",
          },
        },
        facilities: {
          adjustableChairs: false,
          studyType: "group",
          quietness: "quiet",
          daylit: true,
          powerOutlets: true,
          ethernet: true,
          stationaryPC: false,
          whiteBoard: true,
          smartBoard: false,
          presentationScreen: false,
          nearCoffeeMachine: false,
          nearPrinter: false,
          nearBathroom: true,
        },
        spaceId: "SSP00001",
        floor: "1e verdieping",
        seats: 72,
        tables: 9,
        latitude: 52.001591,
        longitude: 4.371567,
        roomId: "C-1-801",
        exchangeBuildingId: "Building-34@tudelft.nl",
        exchangeRoomId: "",
      },
    ]);
  });
});
