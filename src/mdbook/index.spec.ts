import * as core from "@actions/core";
import { run } from "./index";
import * as mdbookModule from "./MdBook";
import * as linkcheckModule from "./plugins/Linkcheck";
import * as mermaidModule from "./plugins/Mermaid";
import * as admonishModule from "./plugins/Admonish";
import * as openghModule from "./plugins/OpenGh";
import * as tocModule from "./plugins/Toc";
import * as katexModule from "./plugins/Katex";

jest.mock("./MdBook");
jest.mock("./plugins/Admonish");
jest.mock("./plugins/Linkcheck");
jest.mock("./plugins/Mermaid");
jest.mock("./plugins/OpenGh");
jest.mock("./plugins/Toc");
jest.mock("./plugins/Katex");

describe("Should run action", () => {
  let spyGetBooleanInput: jest.SpyInstance<any>;

  beforeEach(() => {
    spyGetBooleanInput = jest.spyOn(core, "getBooleanInput");
    spyGetBooleanInput.mockReturnValue(false);
  });

  it("should setup mdbook", async () => {
    const mdbookConstructorSpy = jest.spyOn(mdbookModule, "MdBook");
    const mdbookSetupSpy = jest.spyOn(mdbookModule.MdBook.prototype, "setup");

    await run();

    expect(mdbookConstructorSpy).toBeCalledTimes(1);
    expect(mdbookSetupSpy).toBeCalledTimes(1);
  });

  describe("with linkcheck plugin", () => {
    beforeEach(() => {
      spyGetBooleanInput.mockImplementation(
        (activatedPlugin) => activatedPlugin === "use-linkcheck"
      );
    });

    it("should setup", async () => {
      const linkcheckConstructorSpy = jest.spyOn(linkcheckModule, "Linkcheck");
      const linkcheckSetupSpy = jest.spyOn(
        linkcheckModule.Linkcheck.prototype,
        "setup"
      );

      await run();

      expect(linkcheckConstructorSpy).toBeCalledTimes(1);
      expect(linkcheckSetupSpy).toBeCalledTimes(1);
    });
  });

  describe("with mermaid plugin", () => {
    beforeEach(() => {
      spyGetBooleanInput.mockImplementation(
        (activatedPlugin) => activatedPlugin === "use-mermaid"
      );
    });

    it("should setup", async () => {
      const mermaidConstructorSpy = jest.spyOn(mermaidModule, "Mermaid");
      const mermaidSetupSpy = jest.spyOn(
        mermaidModule.Mermaid.prototype,
        "setup"
      );

      await run();

      expect(mermaidConstructorSpy).toBeCalledTimes(1);
      expect(mermaidSetupSpy).toBeCalledTimes(1);
    });
  });

  describe("with toc plugin", () => {
    beforeEach(() => {
      spyGetBooleanInput.mockImplementation(
        (activatedPlugin) => activatedPlugin === "use-toc"
      );
    });

    it("should setup", async () => {
      const tocConstructorSpy = jest.spyOn(tocModule, "Toc");
      const tocSetupSpy = jest.spyOn(tocModule.Toc.prototype, "setup");

      await run();

      expect(tocConstructorSpy).toBeCalledTimes(1);
      expect(tocSetupSpy).toBeCalledTimes(1);
    });
  });

  describe("with opengh plugin", () => {
    beforeEach(() => {
      spyGetBooleanInput.mockImplementation(
        (activatedPlugin) => activatedPlugin === "use-opengh"
      );
    });

    it("should setup", async () => {
      const openGhConstructorSpy = jest.spyOn(openghModule, "OpenGh");
      const openGhSetupSpy = jest.spyOn(openghModule.OpenGh.prototype, "setup");

      await run();

      expect(openGhConstructorSpy).toBeCalledTimes(1);
      expect(openGhSetupSpy).toBeCalledTimes(1);
    });
  });

  describe("with admonish plugin", () => {
    beforeEach(() => {
      spyGetBooleanInput.mockImplementation(
        (activatedPlugin) => activatedPlugin === "use-admonish"
      );
    });

    it("should setup", async () => {
      const admonishConstructorSpy = jest.spyOn(admonishModule, "Admonish");
      const admonishSetupSpy = jest.spyOn(
        admonishModule.Admonish.prototype,
        "setup"
      );

      await run();

      expect(admonishConstructorSpy).toBeCalledTimes(1);
      expect(admonishSetupSpy).toBeCalledTimes(1);
    });
  });

  describe("with katex plugin", () => {
    beforeEach(() => {
      spyGetBooleanInput.mockImplementation(
        (activatedPlugin) => activatedPlugin === "use-katex"
      );
    });

    it("should setup", async () => {
      const katexConstructorSpy = jest.spyOn(katexModule, "Katex");
      const katexSetupSpy = jest.spyOn(katexModule.Katex.prototype, "setup");

      await run();

      expect(katexConstructorSpy).toBeCalledTimes(1);
      expect(katexSetupSpy).toBeCalledTimes(1);
    });
  });
});
