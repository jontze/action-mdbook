import os from "os";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as exec from "@actions/exec";
import { Repo } from "../../utils/Repo";
import { Version } from "../../utils/Version";

export class Linkcheck {
  private readonly version: Version;
  private readonly repo: Repo;
  private readonly platform: NodeJS.Platform;

  constructor() {
    this.version = new Version(core.getInput("linkcheck-version"));
    this.repo = new Repo("Michael-F-Bryan/mdbook-linkcheck");
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
      // Download latest release
      const downloadUrl = (await this.repo.getLatestRelease()).assets.find(
        (asset) => asset.browser_download_url.includes("unknown-linux-gnu")
      );
      if (downloadUrl == null) {
        throw new Error("Download url not found!");
      }
      return downloadUrl.browser_download_url;
    } else {
      // Download statisfying version release with a binary
      const releases = await this.repo.getReleases();
      const versions: string[] = [];
      releases.forEach((release) => {
        if (
          release.prerelease === false &&
          release.assets.length !== 0 &&
          release.assets.find((asset) =>
            asset.browser_download_url.includes("unknown-linux-gnu")
          )
        ) {
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

  private async install(url: string) {
    core.info(`Download linkcheck binary from ${url}`);
    const downloadPath = await tc.downloadTool(url);
    let binPath: string;
    if (url.endsWith(".zip")) {
      binPath = await tc.extractZip(downloadPath);
    } else {
      binPath = await tc.extractTar(downloadPath);
    }
    const exitCode = await exec.exec("chmod", [
      "+x",
      `${binPath}/mdbook-linkcheck`,
    ]);
    if (exitCode !== 0) {
      throw new Error(
        `Could not convert mdbook-linkcheck binary to executable, failed with exit code ${exitCode}`
      );
    }
    core.addPath(binPath);
    core.info("mdbook-linkcheck extracted and added to path");
  }

  async setup(): Promise<void> {
    core.info(`Setup mdbook-linkcheck ${this.version.wanted}...`);
    const url = await this.getDownloadUrl();
    await this.install(url);
  }
}
