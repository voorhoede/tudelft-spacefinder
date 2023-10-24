import { describe, it, expect } from "vitest";
import { getSpaceSlug, getSpace } from "./transform-spaces";

describe("Space slugification", () => {
  it("works", () => {
    expect(getSpaceSlug("SSP00001", "GANG")).toEqual("ssp00001--gang");
  });

  it("trims", () => {
    expect(getSpaceSlug(" SSP00001  ", "  GANG ")).toEqual("ssp00001--gang");
  });
});
