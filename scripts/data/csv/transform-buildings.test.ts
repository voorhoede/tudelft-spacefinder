import { describe, it, expect } from "vitest";
import { getBuildingI18n } from "./transform-buildings";

describe("Building i18n properties transformation", () => {
  it("works", () => {
    expect(getBuildingI18n(13, "13 - Architecture", "Arch")).toEqual({
      abbreviation: "Arch",
      name: "Architecture",
      slug: "13-arch",
    });
  });

  it("trims", () => {
    expect(getBuildingI18n(13, " 13  -  Architecture ", " Arch ")).toEqual({
      abbreviation: "Arch",
      name: "Architecture",
      slug: "13-arch",
    });
  });

  it("handles names with dashes", () => {
    expect(getBuildingI18n(13, " 13  -  Architecture- etc ", " Arch ")).toEqual(
      {
        abbreviation: "Arch",
        name: "Architecture- etc",
        slug: "13-arch",
      }
    );
  });
});

// test("is able to handle bad data", () => {
//   let result = fromI18n({ foo: "bar" });
//   expect(result).toEqual({});

//   result = fromI18n({ name: "foo" });
//   expect(result).toEqual({});

//   result = fromI18n({ name: "12-bad", abbreviation: "" });
//   expect(result).toEqual({});
// });
