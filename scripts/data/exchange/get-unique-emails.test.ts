import { describe, it, expect } from "vitest";
import getEmails from "./get-unique-emails";

describe("Getting unique emails", () => {
  it("works", () => {
    expect(
      getEmails([
        { exchangeBuildingId: "e1@my.com", exchangeRoomId: "e2@my.com" },
        { exchangeBuildingId: "e1@my.com", exchangeRoomId: "e2@my.com" },
        { exchangeBuildingId: "e1@my.com", exchangeRoomId: "e3@my.com" },
        { exchangeBuildingId: "e10@my.com", exchangeRoomId: "e20@my.com" },
      ])
    ).toEqual([
      "e10@my.com",
      "e1@my.com",
      "e20@my.com",
      "e2@my.com",
      "e3@my.com",
    ]);
  });

  it("skips empty", () => {
    expect(
      getEmails([
        { exchangeBuildingId: "e1@my.com", exchangeRoomId: "e2@my.com" },
        { exchangeBuildingId: "e1@my.com", exchangeRoomId: "e2@my.com" },
        { exchangeBuildingId: "e1@my.com", exchangeRoomId: "" },
        { exchangeBuildingId: "", exchangeRoomId: "e20@my.com" },
      ])
    ).toEqual(["e1@my.com", "e20@my.com", "e2@my.com"]);
  });

  //TODO maybe trim after Exchange resurrection
  // it("trims", () => {
  //   expect(
  //     getEmails([
  //       { exchangeBuildingId: "e1@my.com", exchangeRoomId: "  e2@my.com" },
  //       { exchangeBuildingId: "e1@my.com  ", exchangeRoomId: "e2@my.com" },
  //       { exchangeBuildingId: "e1@my.com", exchangeRoomId: " " },
  //       { exchangeBuildingId: "", exchangeRoomId: "e20@my.com  " },
  //     ])
  //   ).toEqual(["e1@my.com", "e20@my.com", "e2@my.com"]);
  // });
});
