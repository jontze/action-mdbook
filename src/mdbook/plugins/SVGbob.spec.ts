import { SVGbob } from "./SVGbob";

import * as PluginModule from "./MdPlugin";

jest.mock("./MdPlugin");

describe("SVGbob", () => {
  it("should init class", () => {
    const constructorSpy = jest.spyOn(PluginModule, "MdPlugin");
    const linkchecker = new SVGbob();

    expect(constructorSpy).toHaveBeenCalledWith(
      "boozook/mdbook-svgbob",
      "svgbob-version",
      "mdbook-svgbob",
      "unknown-linux-gnu"
    );
    expect(linkchecker).toBeDefined();
  });
});
