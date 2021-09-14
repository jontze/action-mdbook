import { Linkcheck } from "./Linkcheck";

import * as PluginModule from "./MdPlugin";

jest.mock("./MdPlugin");

describe("Linkcheck", () => {
  it("should init class", () => {
    const constructorSpy = jest.spyOn(PluginModule, "MdPlugin");
    const linkchecker = new Linkcheck();

    expect(constructorSpy).toHaveBeenCalledWith(
      "Michael-F-Bryan/mdbook-linkcheck",
      "linkcheck-version",
      "mdbook-linkcheck",
      "unknown-linux-gnu"
    );
    expect(linkchecker).toBeDefined();
  });
});
