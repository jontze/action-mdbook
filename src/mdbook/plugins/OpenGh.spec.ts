import { OpenGh } from "./OpenGh";

import * as PluginModule from "./MdPlugin";

jest.mock("./MdPlugin");

describe("OpenGh", () => {
  it("should construct class", () => {
    const constructorSpy = jest.spyOn(PluginModule, "MdPlugin");

    const openGhPlugin = new OpenGh();

    expect(openGhPlugin).toBeDefined();
    expect(constructorSpy).toHaveBeenCalledWith(
      "badboy/mdbook-open-on-gh",
      "opengh-version",
      "mdbook-open-on-gh",
      "unknown-linux-musl"
    );
  });
});
