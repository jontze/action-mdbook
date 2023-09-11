import { Katex } from "./Katex";

import * as PluginModule from "./MdPlugin";

jest.mock("./MdPlugin");

describe("Katex", () => {
  it("should init class", () => {
    const constructorSpy = jest.spyOn(PluginModule, "MdPlugin");
    const katex = new Katex();

    expect(constructorSpy).toHaveBeenCalledWith(
      "lzanini/mdbook-katex",
      "katex-version",
      "mdbook-katex",
      "x86_64-unknown-linux-musl",
    );
    expect(katex).toBeDefined();
  });
});
