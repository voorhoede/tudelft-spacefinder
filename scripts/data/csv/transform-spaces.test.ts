import { getSpaceSlug, getSpace } from "./transform-spaces";

describe("Space slugification", () => {
  it("works", () => {
    expect(getSpaceSlug("SSP00001", "GANG")).toEqual("ssp00001--gang");
  });

  it("trims", () => {
    expect(getSpaceSlug(" SSP00001  ", "  GANG ")).toEqual("ssp00001--gang");
  });
});

describe("Space transformation", () => {
  it("works", () => {
    expect(
      getSpace(34, {
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
      })
    ).toEqual({
      buildingNumber: 34,
      slug: "ssp00001--gang",
      i18n: {
        nl: {
          name: "GANG",
        },
        en: {
          name: "Study Spot",
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
    });
  });
});
