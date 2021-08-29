import * as core from "@actions/core";
import { Repo } from "./Repo";

const mockListReleases = jest.fn();
const mockGetReleaseByTag = jest.fn();
const mockGetLatestRelease = jest.fn();
jest.mock("@actions/github", () => {
  return {
    getOctokit: jest.fn().mockImplementation(() => {
      return {
        rest: {
          repos: {
            listReleases: mockListReleases,
            getLatestRelease: mockGetLatestRelease,
            getReleaseByTag: mockGetReleaseByTag,
          },
        },
      };
    }),
  };
});

describe("Repo", () => {
  let spyGetInput: jest.SpyInstance<
    string,
    [name: string, options?: core.InputOptions]
  >;
  beforeEach(() => {
    spyGetInput = jest.spyOn(core, "getInput");
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    spyGetInput.mockReset();
    spyGetInput.mockClear();
  });

  afterAll(() => {});

  it("should init with token", () => {
    spyGetInput.mockReturnValue("token");
    const rr = new Repo("owner/repo");
    expect(rr).toBeDefined();
    expect(spyGetInput).toHaveBeenCalledWith("token");
  });

  it("should fail without token", () => {
    expect(() => new Repo("owner/repo")).toThrowError("GitHub token not found");
  });

  it("should fail without owner", () => {
    expect(() => new Repo("/repo")).toThrowError(
      "Repository owner not defined"
    );
  });

  it("should fail without repo name", () => {
    expect(() => new Repo("owner/")).toThrowError("Projekt name not defined");
  });

  it("should request all releases", async () => {
    mockListReleases.mockResolvedValue({ status: 200, data: "data" });
    spyGetInput.mockReturnValue("token");
    const r = new Repo("owner/repo");
    let res = await r.getReleases();
    expect(spyGetInput).toHaveBeenCalledWith("token");
    expect(res).toBe("data");
    expect(mockListReleases).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
    });
  });

  it("should throw error if request to all releases returns non 200 status code", async () => {
    mockListReleases.mockResolvedValue({ status: 500, data: "data" });
    spyGetInput.mockReturnValue("token");
    const r = new Repo("owner/repo");
    try {
      await r.getReleases();
    } catch (e: any) {
      expect(spyGetInput).toHaveBeenCalledWith("token");
      expect(e.message).toContain("failed with status code");
      expect(mockListReleases).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
      });
    }
  });

  it("should request latest releases", async () => {
    mockGetLatestRelease.mockResolvedValue({ status: 200, data: "data" });
    spyGetInput.mockReturnValue("token");
    const r = new Repo("owner/repo");
    let res = await r.getLatestRelease();
    expect(spyGetInput).toHaveBeenCalledWith("token");
    expect(res).toBe("data");
    expect(mockGetLatestRelease).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
    });
  });

  it("should throw error if request to latest release returns non 200 status code", async () => {
    mockGetLatestRelease.mockResolvedValue({ status: 500, data: "data" });
    spyGetInput.mockReturnValue("token");
    const r = new Repo("owner/repo");
    try {
      await r.getLatestRelease();
    } catch (e: any) {
      expect(spyGetInput).toHaveBeenCalledWith("token");
      expect(e.message).toContain("failed with status code");
      expect(mockGetLatestRelease).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
      });
    }
  });

  it("should request releases by tag", async () => {
    mockGetReleaseByTag.mockResolvedValue({ status: 200, data: "data" });
    const tag = "v2.1";
    spyGetInput.mockReturnValue("token");
    const r = new Repo("owner/repo");
    let res = await r.getReleaseByTag(tag);
    expect(spyGetInput).toHaveBeenCalledWith("token");
    expect(res).toBe("data");
    expect(mockGetReleaseByTag).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      tag,
    });
  });

  it("should throw error if request to all release by tag returns non 200 status code", async () => {
    mockGetReleaseByTag.mockResolvedValue({ status: 500, data: "data" });
    const tag = "v2.1";
    spyGetInput.mockReturnValue("token");
    const r = new Repo("owner/repo");
    try {
      await r.getReleaseByTag(tag);
    } catch (e: any) {
      expect(spyGetInput).toHaveBeenCalledWith("token");
      expect(e.message).toContain("failed with status code");
      expect(mockGetReleaseByTag).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        tag,
      });
    }
  });
});
