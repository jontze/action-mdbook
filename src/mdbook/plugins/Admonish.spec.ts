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
      "x86_64-unknown-linux-musl",
    );
    expect(admonish).toBeDefined();
  });
});
