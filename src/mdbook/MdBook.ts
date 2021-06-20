import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import os from "os";
import { Repo } from "../utils/Repo";
import { Version } from "../utils/Version";

export class MdBook {
  private readonly version: Version;
  private readonly repo: Repo;
  private readonly platform: NodeJS.Platform;

  constructor() {
    this.version = new Version(core.getInput("mdbook-version"));
    this.repo = new Repo("rust-lang/mdBook");
    this.platform = os.platform();
    this.validateOs();
  }

  private validateOs() {
    if (this.platform !== "linux") {
      throw new Error(
        `Unsupported operating system '${this.platform}. This action supports only linux.'`
      );
    }
  }

  private async getDownloadUrl(): Promise<string> {
    if (this.version.wanted === "latest") {
      const downloadUrl = (await this.repo.getLatestRelease()).assets.find(
        (asset) => asset.browser_download_url.includes("unknown-linux-gnu")
      );
      if (downloadUrl == null) {
        throw new Error("Download url not found!");
      }
      return downloadUrl.browser_download_url;
    } else {
      const releases = await this.repo.getReleases();
      const versions: string[] = [];
      releases.forEach((release) => {
        if (release.prerelease === false) {
          versions.push(release.tag_name);
        }
      });
      const choosedVersion = this.version.findMaxStatisfyingVersion(versions);
      core.info(`Latest statisfying version is: ${choosedVersion}`);
      const downloadUrl = (
        await this.repo.getReleaseByTag(choosedVersion)
      ).assets.find((asset) =>
        asset.browser_download_url.includes("unknown-linux-gnu")
      );
      if (downloadUrl == null) {
        throw new Error("Download url not found!");
      }
      return downloadUrl.browser_download_url;
    }
  }

  private async install(url: string): Promise<void> {
    core.info(`Download mdBook binary from ${url}`);
    const downloadPath = await tc.downloadTool(url);
    const binPath = await tc.extractTar(downloadPath);
    core.addPath(binPath);
    core.info("MdBook extracted and added to path");
  }

  async setup(): Promise<void> {
    core.info(`Setup mdBook ${this.version.wanted}...`);
    const url = await this.getDownloadUrl();
    await this.install(url);
  }
}
