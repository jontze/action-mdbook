import os from "os";
import * as core from "@actions/core";
import { MdPlugin } from "./MdPlugin";

const mockDownloadBinary = jest.fn();
const mockInstall = jest.fn();

jest.mock("../../utils/Repo", () => {
  return {
    Repo: jest.fn(),
  };
});
jest.mock("../../utils/Loader", () => {
  return {
    Loader: jest.fn().mockImplementation(() => {
      return {
        downloadBinary: mockDownloadBinary,
        archiveType: "archive",
      };
    }),
  };
});
jest.mock("../../utils/Installer", () => {
  return {
    Installer: jest.fn().mockImplementation(() => {
      return {
        install: mockInstall,
      };
    }),
  };
});
jest.mock("../../utils/Version", () => {
  return {
    Version: jest.fn().mockReturnValue({
      wanted: "versionString",
    }),
  };
});

describe("MdPlugin", () => {
  let spyPlatform: jest.SpyInstance<NodeJS.Platform>;
  let spyGetInput: jest.SpyInstance<
    string,
    [name: string, options?: core.InputOptions]
  >;
  let spyInfo: jest.SpyInstance<void, [message: string]>;

  beforeEach(() => {
    spyPlatform = jest.spyOn(os, "platform").mockReturnValue("linux");
    spyGetInput = jest.spyOn(core, "getInput");
    spyInfo = jest.spyOn(core, "info");
    spyInfo.mockImplementation(() => {});
  });

  afterEach(() => {
    spyGetInput.mockReset();
    spyPlatform.mockReset();
    spyInfo.mockReset();
    mockDownloadBinary.mockReset();
    mockInstall.mockReset();
  });

  it("should init MdPlugin", () => {
    spyGetInput.mockReturnValueOnce("latest");
    const plugin = new MdPlugin(
      "repoName",
      "test-key",
      "platformName",
      "binaryName",
    );
    expect(plugin).toBeDefined();
    expect(spyPlatform).toHaveBeenCalledTimes(1);
    spyPlatform.mockReturnValueOnce("linux");
    expect(spyGetInput).toHaveBeenCalledWith("test-key");
  });

  it("should fail to init MdPlugin due to unsupported OS", () => {
    spyGetInput.mockReturnValueOnce("latest");
    spyPlatform.mockReturnValueOnce("darwin");
    expect(
      () => new MdPlugin("repoName", "test-key", "platformName", "binaryName"),
    ).toThrowError(
      `Unsupported operating system 'darwin'. This plugin supports only linux.`,
    );
    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toHaveBeenCalledWith("test-key");
  });

  it("should setup MdPlugin", async () => {
    spyGetInput.mockReturnValueOnce("latest");
    mockDownloadBinary.mockResolvedValueOnce("downloadPath");

    const plugin = new MdPlugin(
      "repoName",
      "test-key",
      "platformName",
      "binaryName",
    );
    await plugin.setup();

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(2);
    expect(mockDownloadBinary).toHaveBeenCalledTimes(1);
    expect(mockInstall).toHaveBeenCalledTimes(1);
  });
});
