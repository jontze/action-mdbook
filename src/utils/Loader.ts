import { info, warning } from "@actions/core";
import { downloadTool } from "@actions/tool-cache";
import { extname } from "path";
import { ARCHIVE_TYPE } from "../typings";

import { Repo } from "./Repo";
import { Version } from "./Version";

export class Loader {
  archiveType?: ARCHIVE_TYPE;

  constructor(
    private readonly repo: Repo,
    private readonly version: Version,
    private readonly binaryPlatformString: string
  ) {}

  async downloadBinary(): Promise<string> {
    let downloadUrl: string;
    if (this.version.wanted === "latest") {
      // Download latest release
      downloadUrl = await this.getLatestDownloadUrl();
    } else {
      // Download statisfying version release with a binary
      downloadUrl = await this.getDownloadUrlByRelease();
    }
    this.archiveType = this.extractArchiveType(downloadUrl);
    info(`Download ${this.repo} binary from ${downloadUrl}`);
    return downloadTool(downloadUrl);
  }

  private extractArchiveType(fileName: string): ARCHIVE_TYPE {
    const fileType = extname(fileName);
    switch (fileType) {
      case ".zip":
        return ARCHIVE_TYPE.ZIP;
      case ".7z":
        return ARCHIVE_TYPE.SEVENZ;
      case ".xar":
        return ARCHIVE_TYPE.XAR;
      case ".tar":
      case ".gz":
        return ARCHIVE_TYPE.TAR;
      default:
        throw new Error("Unsupported archive type");
    }
  }

  private async getLatestDownloadUrl(): Promise<string> {
    const downloadUrl = (await this.repo.getLatestRelease()).assets.find(
      (asset) => asset.browser_download_url.includes(this.binaryPlatformString)
    );
    if (downloadUrl == null) {
      // Fetch all releases and use the latest release with a matching binary
      warning("The latest release doesn't include a valid binary...");
      warning("Searching for older release...");
      let version: string | null = null;
      const releases = await this.repo.getReleases();
      releases.forEach((release) => {
        if (
          version == null &&
          release.prerelease === false &&
          release.assets.length !== 0 &&
          release.assets.find((asset) =>
            asset.browser_download_url.includes(this.binaryPlatformString)
          )
        ) {
          version = release.tag_name;
        }
      });
      if (version == null) {
        throw new Error("No release found with a matching linux binary");
      }
      info(`Latest version with a valid release binary is: ${version}`);
      const downloadUrlLatestValidRelease = (
        await this.repo.getReleaseByTag(version)
      ).assets.find((asset) =>
        asset.browser_download_url.includes(this.binaryPlatformString)
      );
      if (downloadUrlLatestValidRelease == null) {
        throw new Error("Download url not found!");
      }
      return downloadUrlLatestValidRelease.browser_download_url;
    }
    return downloadUrl.browser_download_url;
  }

  private async getDownloadUrlByRelease(): Promise<string> {
    const releases = await this.repo.getReleases();
    const versions: string[] = [];
    releases.forEach((release) => {
      if (
        release.prerelease === false &&
        release.assets.length !== 0 &&
        release.assets.find((asset) =>
          asset.browser_download_url.includes(this.binaryPlatformString)
        )
      ) {
        versions.push(release.tag_name);
      }
    });
    const choosedVersion = this.version.findMaxStatisfyingVersion(versions);
    info(`Latest statisfying version is: ${choosedVersion}`);
    const downloadUrl = (
      await this.repo.getReleaseByTag(choosedVersion)
    ).assets.find((asset) =>
      asset.browser_download_url.includes(this.binaryPlatformString)
    );
    if (downloadUrl == null) {
      throw new Error("Download url not found!");
    }
    return downloadUrl.browser_download_url;
  }
}
