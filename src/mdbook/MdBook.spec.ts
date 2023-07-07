import os from "os";
import * as core from "@actions/core";
import { MdBook } from "./MdBook";

const mockDownloadBinary = jest.fn();
const mockInstall = jest.fn();

jest.mock("../utils/Repo", () => {
  return {
    Repo: jest.fn(),
  };
});
jest.mock("../utils/Loader", () => {
  return {
    Loader: jest.fn().mockImplementation(() => {
      return {
        downloadBinary: mockDownloadBinary,
        archiveType: "archive",
      };
    }),
  };
});
jest.mock("../utils/Installer", () => {
  return {
    Installer: jest.fn().mockImplementation(() => {
      return {
        install: mockInstall,
      };
    }),
  };
});
jest.mock("../utils/Version", () => {
  return {
    Version: jest.fn().mockReturnValue({
      wanted: "versionString",
    }),
  };
});

describe("MdBook", () => {
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

  it("should init MdBook", () => {
    spyGetInput.mockReturnValueOnce("latest");
    const book = new MdBook();
    expect(book).toBeDefined();
    expect(spyPlatform).toHaveBeenCalledTimes(1);
    spyPlatform.mockReturnValueOnce("linux");
    expect(spyGetInput).toHaveBeenCalledWith("mdbook-version");
  });

  it("should fail to init MdBook due to unsupported OS", () => {
    spyGetInput.mockReturnValueOnce("latest");
    spyPlatform.mockReturnValueOnce("darwin");
    expect(() => new MdBook()).toThrowError(
      `Unsupported operating system 'darwin'. This action supports only linux.`,
    );
    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toHaveBeenCalledWith("mdbook-version");
  });

  it("should setup MdBook", async () => {
    spyGetInput.mockReturnValueOnce("latest");
    mockDownloadBinary.mockResolvedValueOnce("downloadPath");

    const book = new MdBook();
    await book.setup();

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(1);
    expect(mockDownloadBinary).toHaveBeenCalledTimes(1);
    expect(mockInstall).toHaveBeenCalledTimes(1);
  });

  /*
  it("should fail on setup latest MdBook version due to missing linux binary", async () => {
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath");
    spyGetInput.mockReturnValueOnce("latest");

    const book = new MdBook();
    try {
      await book.setup();
    } catch (err: any) {
      expect(err.message).toBe("Download url not found!");
    }

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).not.toHaveBeenCalledTimes(1);
    expect(spyExtractTar).not.toHaveBeenCalledTimes(1);
    expect(spyAddPath).not.toHaveBeenCalledTimes(1);
  });

  it("should setup a specific MdBook version", async () => {
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath");
    spyGetInput.mockReturnValueOnce("v1.2.3");

    const book = new MdBook();
    await book.setup();

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(4);
    expect(spyDownloadTool).toHaveBeenCalledTimes(1);
    expect(spyExtractTar).toHaveBeenCalledTimes(1);
    expect(spyAddPath).toHaveBeenCalledTimes(1);
  });

  it("should fail on setup specific MdBook version due to missing linux binary", async () => {
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath");
    spyGetInput.mockReturnValueOnce("v1.2.3");

    const book = new MdBook();
    try {
      await book.setup();
    } catch (err: any) {
      expect(err.message).toBe("Download url not found!");
    }

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(2);
    expect(spyDownloadTool).not.toHaveBeenCalledTimes(1);
    expect(spyExtractTar).not.toHaveBeenCalledTimes(1);
    expect(spyAddPath).not.toHaveBeenCalledTimes(1);
  });
  */
});
