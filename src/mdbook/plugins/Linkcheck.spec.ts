import { Linkcheck } from "./Linkcheck";

import * as PluginModule from "./MdPlugin";

jest.mock("./MdPlugin");

describe("Linkcheck", () => {
  it("should init class", () => {
    const constructorSpy = jest.spyOn(PluginModule, "MdPlugin");
    const linkchecker = new Linkcheck();

    expect(constructorSpy).toHaveBeenCalledWith(
      "marxin/mdbook-linkcheck2",
      "linkcheck-version",
      "mdbook-linkcheck2",
      "unknown-linux-gnu",
    );
    expect(linkchecker).toBeDefined();
  });
});
