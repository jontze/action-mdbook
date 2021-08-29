import os from "os";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as exec from "@actions/exec";
import { IHeaders } from "@actions/http-client/interfaces";
import { Linkcheck } from "./Linkcheck";

const mockGetLatestRelease = jest.fn();
const mockGetReleases = jest.fn();
const mockGetReleaseByTag = jest.fn();

jest.mock("../../utils/Repo", () => {
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

describe("Linkcheck", () => {
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
  let spyExtractZip: jest.SpyInstance<
    Promise<string>,
    [file: string, dest?: string]
  >;
  let spyExec: jest.SpyInstance<
    Promise<number>,
    [commandLine: string, args?: string[], options?: exec.ExecOptions]
  >;

  beforeEach(() => {
    spyPlatform = jest.spyOn(os, "platform").mockReturnValue("linux");
    spyGetInput = jest.spyOn(core, "getInput");
    spyInfo = jest.spyOn(core, "info");
    spyAddPath = jest.spyOn(core, "addPath");
    spyDownloadTool = jest.spyOn(tc, "downloadTool");
    spyExtractTar = jest.spyOn(tc, "extractTar");
    spyExtractZip = jest.spyOn(tc, "extractZip");
    spyExec = jest.spyOn(exec, "exec");
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
    spyExtractZip.mockReset();
    spyExtractZip.mockClear();
    spyExec.mockReset();
    spyExec.mockClear();
    mockGetLatestRelease.mockReset();
    mockGetReleases.mockReset();
    mockGetReleaseByTag.mockReset();
  });

  it("should init Linkcheck plugin", () => {
    spyGetInput.mockReturnValueOnce("latest");
    const linkcheck = new Linkcheck();
    expect(linkcheck).toBeDefined();
    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toHaveBeenCalledWith("linkcheck-version");
  });

  it("should fail to init Linkcheck plugin due to unsupported OS", () => {
    spyGetInput.mockReturnValueOnce("latest");
    spyPlatform.mockReturnValueOnce("darwin");
    expect(() => new Linkcheck()).toThrowError();
    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toHaveBeenCalledWith("linkcheck-version");
  });

  it("should setup latest Linkchecker version", async () => {
    spyExec.mockResolvedValueOnce(0);
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath.tar");
    spyGetInput.mockReturnValueOnce("latest");
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [{ browser_download_url: "unknown-linux-gnu.tar" }],
    });

    const linkcheck = new Linkcheck();
    await linkcheck.setup();

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(3);
    expect(mockGetLatestRelease).toHaveBeenCalledTimes(1);
    expect(spyExec).toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).toHaveBeenCalledTimes(1);
    expect(spyExtractTar).toHaveBeenCalledTimes(1);
    expect(spyAddPath).toHaveBeenCalledTimes(1);
  });

  it("should setup latest Linkchecker version and unpack zip", async () => {
    spyExec.mockResolvedValueOnce(0);
    spyExtractZip.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath");
    spyGetInput.mockReturnValueOnce("latest");
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [{ browser_download_url: "unknown-linux-gnu.zip" }],
    });

    const linkcheck = new Linkcheck();
    await linkcheck.setup();

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(3);
    expect(mockGetLatestRelease).toHaveBeenCalledTimes(1);
    expect(spyExec).toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).toHaveBeenCalledTimes(1);
    expect(spyExtractTar).not.toHaveBeenCalled();
    expect(spyExtractZip).toHaveBeenCalledTimes(1);
    expect(spyAddPath).toHaveBeenCalledTimes(1);
  });

  it("should fail on setup latest Linkchecker version due to missing linux binary", async () => {
    spyExec.mockResolvedValueOnce(0);
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath");
    spyGetInput.mockReturnValueOnce("latest");
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [],
    });
    try {
      const linkcheck = new Linkcheck();
      await linkcheck.setup();
    } catch (err: any) {
      expect(err.message).toBe("Download url not found!");
    }
    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(1);
    expect(mockGetLatestRelease).toHaveBeenCalledTimes(1);
    expect(spyExec).not.toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).not.toHaveBeenCalledTimes(1);
    expect(spyExtractTar).not.toHaveBeenCalledTimes(1);
    expect(spyAddPath).not.toHaveBeenCalledTimes(1);
  });

  it("should fail on setup latest Linkchecker version due to fail to convert binary to executable", async () => {
    spyExec.mockResolvedValueOnce(1);
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath.tar");
    spyGetInput.mockReturnValueOnce("latest");
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [{ browser_download_url: "unknown-linux-gnu.tar" }],
    });
    try {
      const linkcheck = new Linkcheck();
      await linkcheck.setup();
    } catch (err: any) {
      expect(err.message).toContain("failed with exit code 1");
    }
    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(2);
    expect(mockGetLatestRelease).toHaveBeenCalledTimes(1);
    expect(spyExec).toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).toHaveBeenCalledTimes(1);
    expect(spyExtractTar).toHaveBeenCalledTimes(1);
    expect(spyAddPath).not.toHaveBeenCalledTimes(1);
  });

  it("should setup specific Linkchecker version", async () => {
    spyExec.mockResolvedValueOnce(0);
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath.tar");
    spyGetInput.mockReturnValueOnce("v1.2.3");
    mockGetReleases.mockResolvedValueOnce([
      {
        prerelease: false,
        tag_name: "v1.2.3",
        assets: [],
      },
      {
        prerelease: false,
        tag_name: "v1.2.3",
        assets: [
          {
            browser_download_url: "unknown-linux-gnu",
          },
        ],
      },
      {
        prerelease: true,
        tag_name: "v1.2.3",
      },
    ]);
    mockGetReleaseByTag.mockResolvedValueOnce({
      assets: [{ browser_download_url: "unknown-linux-gnu.tar" }],
    });

    const linkcheck = new Linkcheck();
    await linkcheck.setup();

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(4);
    expect(mockGetReleases).toHaveBeenCalledTimes(1);
    expect(mockGetReleaseByTag).toHaveBeenCalledWith("v1.2.3");
    expect(spyExec).toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).toHaveBeenCalledTimes(1);
    expect(spyExtractTar).toHaveBeenCalledTimes(1);
    expect(spyAddPath).toHaveBeenCalledTimes(1);
  });

  it("should fail on setup specific Linkchecker version due to missing linux binary", async () => {
    spyExec.mockResolvedValueOnce(0);
    spyExtractTar.mockResolvedValueOnce("extractedPath");
    spyDownloadTool.mockResolvedValueOnce("downloadPath.tar");
    spyGetInput.mockReturnValueOnce("v1.2.3");
    mockGetReleases.mockResolvedValueOnce([
      {
        prerelease: false,
        tag_name: "v1.2.3",
        assets: [],
      },
      {
        prerelease: false,
        tag_name: "v1.2.3",
        assets: [
          {
            browser_download_url: "unknown-linux-gnu",
          },
        ],
      },
      {
        prerelease: true,
        tag_name: "v1.2.3",
      },
    ]);
    mockGetReleaseByTag.mockResolvedValueOnce({
      assets: [],
    });

    try {
      const linkcheck = new Linkcheck();
      await linkcheck.setup();
    } catch (err: any) {
      expect(err.message).toBe("Download url not found!");
    }

    expect(spyPlatform).toHaveBeenCalledTimes(1);
    expect(spyGetInput).toBeCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(2);
    expect(mockGetReleases).toHaveBeenCalledTimes(1);
    expect(mockGetReleaseByTag).toHaveBeenCalledWith("v1.2.3");
    expect(spyExec).not.toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).not.toHaveBeenCalledTimes(1);
    expect(spyExtractTar).not.toHaveBeenCalledTimes(1);
    expect(spyAddPath).not.toHaveBeenCalledTimes(1);
  });
});
