import { info, getInput } from "@actions/core";
import { platform } from "os";
import { Installer } from "../utils/Installer";
import { Loader } from "../utils/Loader";
import { Repo } from "../utils/Repo";
import { Version } from "../utils/Version";

export class MdBook {
  private readonly version: Version;
  private readonly repo: Repo;
  private readonly loader: Loader;
  private readonly platform: NodeJS.Platform;

  constructor() {
    this.version = new Version(getInput("mdbook-version"));
    this.repo = new Repo("rust-lang/mdBook");
    this.platform = platform();
    this.loader = new Loader(this.repo, this.version, "unknown-linux-gnu");
    this.validateOs();
  }

  private validateOs() {
    if (this.platform !== "linux") {
      throw new Error(
        `Unsupported operating system '${this.platform}'. This action supports only linux.`
      );
    }
  }

  async setup(): Promise<void> {
    info(`Setup mdBook ${this.version.wanted}...`);
    const archivePath = await this.loader.downloadBinary();
    const installer = new Installer(
      archivePath,
      "mdbook",
      this.loader.archiveType
    );
    await installer.install();
  }
}
