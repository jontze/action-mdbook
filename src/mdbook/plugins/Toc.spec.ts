import { Toc } from "./Toc";

import * as PluginModule from "./MdPlugin";

jest.mock("./MdPlugin");

describe("Toc", () => {
  it("should init class", () => {
    const constructorSpy = jest.spyOn(PluginModule, "MdPlugin");
    const linkchecker = new Toc();

    expect(constructorSpy).toHaveBeenCalledWith(
      "badboy/mdbook-toc",
      "toc-version",
      "mdbook-toc",
      "unknown-linux-gnu"
    );
    expect(linkchecker).toBeDefined();
  });
});
