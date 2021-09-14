import mockFs from "mock-fs";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

import { ARCHIVE_TYPE } from "../typings";
import { Installer } from "./Installer";

describe("Installer", () => {
  let spyInfo: jest.SpyInstance<void, [message: string]>;
  let spyAddPath: jest.SpyInstance<void, [inputPath: string]>;
  let spyExTar: jest.SpyInstance<
    Promise<string>,
    [file: string, dest?: string, flags?: string | string[]]
  >;
  let spyExZip: jest.SpyInstance<
    Promise<string>,
    [file: string, dest?: string]
  >;
  let spyEx7z: jest.SpyInstance<
    Promise<string>,
    [file: string, dest?: string, _7zPath?: string]
  >;
  let spyExXar: jest.SpyInstance<
    Promise<string>,
    [file: string, dest?: string, flags?: string | string[]]
  >;

  beforeEach(() => {
    spyInfo = jest.spyOn(core, "info");
    spyInfo.mockImplementation(() => {});
    spyAddPath = jest.spyOn(core, "addPath");
    spyAddPath.mockImplementation(() => {});
    spyExTar = jest.spyOn(tc, "extractTar");
    spyExZip = jest.spyOn(tc, "extractZip");
    spyEx7z = jest.spyOn(tc, "extract7z");
    spyExXar = jest.spyOn(tc, "extractXar");
  });

  afterEach(() => {
    spyInfo.mockReset();
    spyAddPath.mockReset();
    spyExTar.mockReset();
    spyExZip.mockReset();
    spyEx7z.mockReset();
    spyExXar.mockReset();
    mockFs.restore();
  });

  it("should init Installer", () => {
    const installer = new Installer(
      "downloadPath/",
      "plugin-binary-name",
      ARCHIVE_TYPE.ZIP
    );
    expect(installer).toBeDefined();
  });

  it("should install (zip)", async () => {
    mockFs({
      extractedPath: {
        "plugin-binary-name": { content: "", mode: "755" },
      },
    });
    spyExZip.mockResolvedValueOnce("extractedPath");

    const installer = new Installer(
      "downloadPath/",
      "plugin-binary-name",
      ARCHIVE_TYPE.ZIP
    );
    await installer.install();

    expect(spyExZip).toHaveBeenCalledWith("downloadPath/");
    expect(spyAddPath).toHaveBeenCalledWith("extractedPath");
    expect(spyInfo).toHaveBeenCalledTimes(1);
  });

  it("should install and adjust binary permissions(zip)", async () => {
    mockFs({
      extractedPath: {
        "plugin-binary-name": "content",
      },
    });
    spyExZip.mockResolvedValueOnce("extractedPath");

    const installer = new Installer(
      "downloadPath/",
      "plugin-binary-name",
      ARCHIVE_TYPE.ZIP
    );
    await installer.install();

    expect(spyExZip).toHaveBeenCalledWith("downloadPath/");
    expect(spyAddPath).toHaveBeenCalledWith("extractedPath");
    expect(spyInfo).toHaveBeenCalledTimes(2);
  });
  it("should extract ZIP", async () => {
    mockFs({
      extractedPath: {
        "plugin-binary-name": { content: "", mode: "755" },
      },
    });
    spyExZip.mockResolvedValueOnce("extractedPath");

    const installer = new Installer(
      "downloadPath/",
      "plugin-binary-name",
      ARCHIVE_TYPE.ZIP
    );
    await installer.install();

    expect(spyExZip).toHaveBeenCalledWith("downloadPath/");
  });

  it("should extract TAR", async () => {
    mockFs({
      extractedPath: {
        "plugin-binary-name": { content: "", mode: "755" },
      },
    });
    spyExTar.mockResolvedValueOnce("extractedPath");

    const installer = new Installer(
      "downloadPath/",
      "plugin-binary-name",
      ARCHIVE_TYPE.TAR
    );
    await installer.install();

    expect(spyExTar).toHaveBeenCalledWith("downloadPath/");
  });

  it("should extract XAR", async () => {
    mockFs({
      extractedPath: {
        "plugin-binary-name": { content: "", mode: "755" },
      },
    });
    spyExXar.mockResolvedValueOnce("extractedPath");

    const installer = new Installer(
      "downloadPath/",
      "plugin-binary-name",
      ARCHIVE_TYPE.XAR
    );
    await installer.install();

    expect(spyExXar).toHaveBeenCalledWith("downloadPath/");
  });

  it("should extract 7z", async () => {
    mockFs({
      extractedPath: {
        "plugin-binary-name": { content: "", mode: "755" },
      },
    });
    spyEx7z.mockResolvedValueOnce("extractedPath");

    const installer = new Installer(
      "downloadPath/",
      "plugin-binary-name",
      ARCHIVE_TYPE.SEVENZ
    );
    await installer.install();

    expect(spyEx7z).toHaveBeenCalledWith("downloadPath/");
  });

  it("should fail on archive extraction", async () => {
    expect.assertions(1);

    const installer = new Installer("downloadPath/", "plugin-binary-name");
    try {
      await installer.install();
    } catch (err: any) {
      expect(err).toEqual(new Error("Unkown archive type 'undefined'"));
    }
  });
});
