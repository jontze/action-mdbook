import { Mermaid } from "./Mermaid";

import * as PluginModule from "./MdPlugin";

jest.mock("./MdPlugin");

describe("Mermaid", () => {
  beforeEach(() => {});

  it("should init class", () => {
    const constructorSpy = jest.spyOn(PluginModule, "MdPlugin");

    const mermaid = new Mermaid();

    expect(constructorSpy).toHaveBeenCalledWith(
      "badboy/mdbook-mermaid",
      "mermaid-version",
      "mdbook-mermaid",
      "unknown-linux-gnu"
    );
    expect(mermaid).toBeDefined();
  });
});
