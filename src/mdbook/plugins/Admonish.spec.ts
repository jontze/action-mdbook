import { Admonish } from "./Admonish";

import * as PluginModule from "./MdPlugin";

jest.mock("./MdPlugin");

describe("Admonish", () => {
  it("should init class", () => {
    const constructorSpy = jest.spyOn(PluginModule, "MdPlugin");
    const admonish = new Admonish();

    expect(constructorSpy).toHaveBeenCalledWith(
      "tommilligan/mdbook-admonish",
      "admonish-version",
      "mdbook-admonish",
      "unknown-linux-gnu"
    );
    expect(admonish).toBeDefined();
  });
});
