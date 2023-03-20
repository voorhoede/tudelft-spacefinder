import { buildingNumberFromId } from "./index";

test("parse the building number from a building id", () => {
  let result = buildingNumberFromId("04 - some building name");
  expect(result).toBe(4);
  result = buildingNumberFromId("no building number here");
  expect(result).toBe(undefined);
});
