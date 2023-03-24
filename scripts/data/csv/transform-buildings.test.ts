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
