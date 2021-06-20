import os from "os";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { IHeaders } from "@actions/http-client/interfaces";
import { MdBook } from "./MdBook";

const mockGetLatestRelease = jest.fn();
const mockGetReleases = jest.fn();
const mockGetReleaseByTag = jest.fn();

jest.mock("../utils/Repo", () => {
  return {
    Repo: jest.fn().mockImplementation(() => {
      return {
        getLatestRelease: mockGetLatestRelease,
        getReleases: mockGetReleases,
        getReleaseByTag: mockGetReleaseByTag,
      };
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
  let spyAddPath: jest.SpyInstance<void, [inputPath: string]>;
  let spyDownloadTool: jest.SpyInstance<
    Promise<string>,
    [url: string, dest?: string, auth?: string, headers?: IHeaders]
  >;
  let spyExtractTar: jest.SpyInstance<
    Promise<string>,
    [file: string, dest?: string, flags?: string | string[]]
  >;

  beforeEach(() => {
    spyPlatform = jest.spyOn(os, "platform").mockReturnValue("linux");
    spyGetInput = jest.spyOn(core, "getInput");
    spyInfo = jest.spyOn(core, "info");
    spyAddPath = jest.spyOn(core, "addPath");
    spyDownloadTool = jest.spyOn(tc, "downloadTool");
    spyExtractTar = jest.spyOn(tc, "extractTar");
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    spyGetInput.mockReset();
    spyGetInput.mockClear();
    spyPlatform.mockClear();
    spyPlatform.mockReset();
    spyInfo.mockReset();
    spyInfo.mockClear();
    spyAddPath.mockReset();
    spyAddPath.mockClear();
    spyDownloadTool.mockReset();
    spyDownloadTool.mockClear();
    spyExtractTar.mockReset();
    spyExtractTar.mockClear();
    mockGetLatestRelease.mockReset();
    mockGetReleases.mockReset();
    mockGetReleaseByTag.mockReset();
  });

  it("should init MdBook", () => {
    spyGetInput.mockReturnValueOnce("latest");
    const book = new MdBook();
    expect(book).toBeDefined();
    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toHaveBeenCalledWith("mdbook-version");
  });

  it("should fail to init MdBook due to unsupported OS", () => {
    spyGetInput.mockReturnValueOnce("latest");
    spyPlatform.mockReturnValueOnce("darwin");
    expect(() => new MdBook()).toThrowError();
    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toHaveBeenCalledWith("mdbook-version");
  });

  it("should setup latest MdBook version", async () => {
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath");
    spyGetInput.mockReturnValueOnce("latest");
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [{ browser_download_url: "unknown-linux-gnu" }],
    });

    const book = new MdBook();
    await book.setup();

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(3);
    expect(mockGetLatestRelease).toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).toHaveBeenCalledTimes(1);
    expect(spyExtractTar).toHaveBeenCalledTimes(1);
    expect(spyAddPath).toHaveBeenCalledTimes(1);
  });

  it("should fail on setup latest MdBook version due to missing linux binary", async () => {
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath");
    spyGetInput.mockReturnValueOnce("latest");
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [],
    });

    const book = new MdBook();
    try {
      await book.setup();
    } catch (err) {
      expect(err.message).toBe("Download url not found!");
    }

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(1);
    expect(mockGetLatestRelease).toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).not.toHaveBeenCalledTimes(1);
    expect(spyExtractTar).not.toHaveBeenCalledTimes(1);
    expect(spyAddPath).not.toHaveBeenCalledTimes(1);
  });

  it("should setup a specific MdBook version", async () => {
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath");
    spyGetInput.mockReturnValueOnce("v1.2.3");
    mockGetReleases.mockResolvedValueOnce([
      {
        prerelease: false,
        tag_name: "v1.2.3",
      },
      {
        prerelease: true,
        tag_name: "v1.2.3",
      },
    ]);
    mockGetReleaseByTag.mockResolvedValueOnce({
      assets: [{ browser_download_url: "unknown-linux-gnu" }],
    });

    const book = new MdBook();
    await book.setup();

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(4);
    expect(mockGetReleases).toHaveBeenCalledTimes(1);
    expect(mockGetReleaseByTag).toHaveBeenCalledWith("v1.2.3");
    expect(spyDownloadTool).toHaveBeenCalledTimes(1);
    expect(spyExtractTar).toHaveBeenCalledTimes(1);
    expect(spyAddPath).toHaveBeenCalledTimes(1);
  });

  it("should fail on setup specific MdBook version due to missing linux binary", async () => {
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath");
    spyGetInput.mockReturnValueOnce("v1.2.3");
    mockGetReleases.mockResolvedValueOnce([
      {
        prerelease: false,
        tag_name: "v1.2.3",
      },
      {
        prerelease: true,
        tag_name: "v1.2.3",
      },
    ]);
    mockGetReleaseByTag.mockResolvedValueOnce({
      assets: [],
    });

    const book = new MdBook();
    try {
      await book.setup();
    } catch (err) {
      expect(err.message).toBe("Download url not found!");
    }

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(2);
    expect(mockGetReleases).toHaveBeenCalledTimes(1);
    expect(mockGetReleaseByTag).toHaveBeenCalledWith("v1.2.3");
    expect(spyDownloadTool).not.toHaveBeenCalledTimes(1);
    expect(spyExtractTar).not.toHaveBeenCalledTimes(1);
    expect(spyAddPath).not.toHaveBeenCalledTimes(1);
  });
});
