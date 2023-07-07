import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { ARCHIVE_TYPE } from "../typings";

import { Loader } from "./Loader";
import { Repo } from "./Repo";
import { Version } from "./Version";

const mockGetLatestRelease = jest.fn();
const mockGetReleases = jest.fn();
const mockGetReleaseByTag = jest.fn();

jest.mock("./Repo", () => {
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

describe("Loader", () => {
  let version: Version;
  let repo: Repo;

  let spyInfo: jest.SpyInstance<void, [message: string]>;
  let spyWarning: jest.SpyInstance<
    void,
    [message: string | Error, properties?: core.AnnotationProperties]
  >;
  let spyDownloadTool: jest.SpyInstance<
    Promise<string>,
    [url: string, dest?: string, auth?: string, headers?: any]
  >;

  beforeEach(() => {
    version = new Version("latest");
    repo = new Repo("owner/project");
    spyInfo = jest.spyOn(core, "info");
    spyInfo.mockImplementation(() => {});
    spyWarning = jest.spyOn(core, "warning");
    spyWarning.mockImplementation(() => {});
    spyDownloadTool = jest.spyOn(tc, "downloadTool");
  });

  afterEach(() => {
    mockGetLatestRelease.mockReset();
    mockGetReleases.mockReset();
    mockGetReleaseByTag.mockReset();
    spyInfo.mockReset();
    spyWarning.mockReset();
    spyDownloadTool.mockReset();
  });

  it("should construct class", () => {
    const loader = new Loader(repo, version, "testBinary");

    expect(loader).toBeDefined();
  });

  it("should download binary of latest release (zip)", async () => {
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [
        {
          browser_download_url: "testBinary.zip",
        },
      ],
    });
    spyDownloadTool.mockResolvedValueOnce("downloadPath/");

    const loader = new Loader(repo, version, "testBinary");
    const downloadedPath = await loader.downloadBinary();

    expect(mockGetLatestRelease).toHaveBeenCalledTimes(1);
    expect(spyInfo).toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).toHaveBeenCalledWith("testBinary.zip");
    expect(downloadedPath).toBe("downloadPath/");
    expect(loader.archiveType).toBe(ARCHIVE_TYPE.ZIP);
  });

  it("should download binary of latest release with a valid binary (zip)", async () => {
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [],
    });
    mockGetReleases.mockResolvedValueOnce([
      {
        prerelease: true,
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
      {
        prerelease: false,
        assets: [],
      },
      {
        prerelease: false,
        assets: [
          {
            browser_download_url: "wrongBinaryType",
          },
        ],
      },
      {
        prerelease: false,
        tag_name: "v1.0.0",
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
    ]);
    mockGetReleaseByTag.mockResolvedValueOnce({
      assets: [
        {
          browser_download_url: "testBinary.zip",
        },
      ],
    });
    spyDownloadTool.mockResolvedValueOnce("downloadPath/");

    const loader = new Loader(repo, version, "testBinary");
    const downloadedPath = await loader.downloadBinary();

    expect(mockGetLatestRelease).toHaveBeenCalledTimes(1);
    expect(mockGetReleases).toHaveBeenCalledTimes(1);
    expect(mockGetReleaseByTag).toHaveBeenCalledWith("v1.0.0");
    expect(spyInfo).toHaveBeenCalledTimes(2);
    expect(spyWarning).toHaveBeenCalledTimes(2);
    expect(spyDownloadTool).toHaveBeenCalledWith("testBinary.zip");
    expect(downloadedPath).toBe("downloadPath/");
    expect(loader.archiveType).toBe(ARCHIVE_TYPE.ZIP);
  });

  it("should fail to download latest binary due to no matchig release with a valid binary", async () => {
    expect.assertions(8);
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [],
    });
    mockGetReleases.mockResolvedValueOnce([
      {
        prerelease: true,
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
      {
        prerelease: false,
        assets: [],
      },
      {
        prerelease: false,
        assets: [
          {
            browser_download_url: "wrongBinaryType",
          },
        ],
      },
    ]);
    mockGetReleaseByTag.mockResolvedValueOnce({
      assets: [
        {
          browser_download_url: "testBinary.zip",
        },
      ],
    });
    spyDownloadTool.mockResolvedValueOnce("downloadPath/");

    const loader = new Loader(repo, version, "testBinary");
    try {
      await loader.downloadBinary();
    } catch (err: any) {
      expect(err).toEqual(
        new Error("No release found with a matching linux binary"),
      );
    }

    expect(mockGetLatestRelease).toHaveBeenCalledTimes(1);
    expect(mockGetReleases).toHaveBeenCalledTimes(1);
    expect(mockGetReleaseByTag).not.toHaveBeenCalled();
    expect(spyInfo).not.toHaveBeenCalled();
    expect(spyWarning).toHaveBeenCalledTimes(2);
    expect(spyDownloadTool).not.toHaveBeenCalledWith("testBinary.zip");
    expect(loader.archiveType).toBe(undefined);
  });

  it("should fail to download latest binary due missing download url of matchig release with a valid binary", async () => {
    expect.assertions(8);
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [],
    });
    mockGetReleases.mockResolvedValueOnce([
      {
        prerelease: true,
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
      {
        prerelease: false,
        assets: [],
      },
      {
        prerelease: false,
        assets: [
          {
            browser_download_url: "wrongBinaryType",
          },
        ],
      },
      {
        prerelease: false,
        tag_name: "v1.0.0",
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
    ]);
    mockGetReleaseByTag.mockResolvedValueOnce({
      assets: [],
    });
    spyDownloadTool.mockResolvedValueOnce("downloadPath/");

    const loader = new Loader(repo, version, "testBinary");
    try {
      await loader.downloadBinary();
    } catch (err: any) {
      expect(err).toEqual(new Error("Download url not found!"));
    }

    expect(mockGetLatestRelease).toHaveBeenCalledTimes(1);
    expect(mockGetReleases).toHaveBeenCalledTimes(1);
    expect(mockGetReleaseByTag).toHaveBeenCalledWith("v1.0.0");
    expect(spyInfo).toHaveBeenCalledTimes(1);
    expect(spyWarning).toHaveBeenCalledTimes(2);
    expect(spyDownloadTool).not.toHaveBeenCalledWith("testBinary.zip");
    expect(loader.archiveType).toBe(undefined);
  });

  it("should download binary of release by tag", async () => {
    mockGetReleases.mockResolvedValueOnce([
      {
        prerelease: true,
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
      {
        prerelease: false,
        assets: [],
      },
      {
        prerelease: false,
        assets: [
          {
            browser_download_url: "wrongBinaryType",
          },
        ],
      },
      {
        prerelease: false,
        tag_name: "v1.0.0",
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
      {
        prerelease: false,
        tag_name: "v1.0.1",
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
    ]);
    mockGetReleaseByTag.mockResolvedValueOnce({
      assets: [
        {
          browser_download_url: "testBinary.zip",
        },
      ],
    });
    spyDownloadTool.mockResolvedValueOnce("downloadPath/");

    version = new Version("~v1.0.0");
    const loader = new Loader(repo, version, "testBinary");
    const downloadPath = await loader.downloadBinary();

    expect(mockGetReleases).toHaveBeenCalledTimes(1);
    expect(mockGetReleaseByTag).toHaveBeenCalledWith("v1.0.1");
    expect(spyInfo).toHaveBeenCalledTimes(2);
    expect(spyDownloadTool).toHaveBeenCalledWith("testBinary.zip");
    expect(downloadPath).toBe("downloadPath/");
    expect(loader.archiveType).toBe(ARCHIVE_TYPE.ZIP);
  });

  it("should fail download binary of release by tag due to missing download url", async () => {
    expect.assertions(6);
    mockGetReleases.mockResolvedValueOnce([
      {
        prerelease: true,
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
      {
        prerelease: false,
        assets: [],
      },
      {
        prerelease: false,
        assets: [
          {
            browser_download_url: "wrongBinaryType",
          },
        ],
      },
      {
        prerelease: false,
        tag_name: "v1.0.0",
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
      {
        prerelease: false,
        tag_name: "v1.0.1",
        assets: [
          {
            browser_download_url: "testBinary.zip",
          },
        ],
      },
    ]);
    mockGetReleaseByTag.mockResolvedValueOnce({
      assets: [],
    });
    spyDownloadTool.mockResolvedValueOnce("downloadPath/");

    version = new Version("~v1.0.0");
    const loader = new Loader(repo, version, "testBinary");
    try {
      await loader.downloadBinary();
    } catch (err: any) {
      expect(err).toEqual(new Error("Download url not found!"));
    }

    expect(mockGetReleases).toHaveBeenCalledTimes(1);
    expect(mockGetReleaseByTag).toHaveBeenCalledWith("v1.0.1");
    expect(spyInfo).toHaveBeenCalledTimes(1);
    expect(spyDownloadTool).not.toHaveBeenCalled();
    expect(loader.archiveType).toBe(undefined);
  });

  it("should extract ZIP archive type", async () => {
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [
        {
          browser_download_url: "testBinary.zip",
        },
      ],
    });
    spyDownloadTool.mockResolvedValueOnce("");

    const loader = new Loader(repo, version, "testBinary");
    await loader.downloadBinary();

    expect(loader.archiveType).toBe(ARCHIVE_TYPE.ZIP);
  });

  it("should extract SEVENZ archive type", async () => {
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [
        {
          browser_download_url: "testBinary.7z",
        },
      ],
    });
    spyDownloadTool.mockResolvedValueOnce("");

    const loader = new Loader(repo, version, "testBinary");
    await loader.downloadBinary();

    expect(loader.archiveType).toBe(ARCHIVE_TYPE.SEVENZ);
  });

  it("should extract XAR archive type", async () => {
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [
        {
          browser_download_url: "testBinary.xar",
        },
      ],
    });
    spyDownloadTool.mockResolvedValueOnce("");

    const loader = new Loader(repo, version, "testBinary");
    await loader.downloadBinary();

    expect(loader.archiveType).toBe(ARCHIVE_TYPE.XAR);
  });

  it("should extract TAR archive type", async () => {
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [
        {
          browser_download_url: "testBinary.tar",
        },
      ],
    });
    spyDownloadTool.mockResolvedValueOnce("");

    const loader = new Loader(repo, version, "testBinary");
    await loader.downloadBinary();

    expect(loader.archiveType).toBe(ARCHIVE_TYPE.TAR);
  });

  it("should extract TAR.GZ archive type", async () => {
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [
        {
          browser_download_url: "testBinary.tar.gz",
        },
      ],
    });
    spyDownloadTool.mockResolvedValueOnce("");

    const loader = new Loader(repo, version, "testBinary");
    await loader.downloadBinary();

    expect(loader.archiveType).toBe(ARCHIVE_TYPE.TAR);
  });

  it("should fail to extract archive type", async () => {
    expect.assertions(1);
    mockGetLatestRelease.mockResolvedValueOnce({
      assets: [
        {
          browser_download_url: "testBinary.txt",
        },
      ],
    });
    spyDownloadTool.mockResolvedValueOnce("");

    const loader = new Loader(repo, version, "testBinary");
    try {
      await loader.downloadBinary();
    } catch (err: any) {
      expect(err).toEqual(new Error("Unsupported archive type"));
    }
  });
});
