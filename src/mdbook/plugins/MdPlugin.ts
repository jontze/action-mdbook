import { platform } from "os";
import { info, getInput } from "@actions/core";
import { Loader } from "../../utils/Loader";
import { Repo } from "../../utils/Repo";
import { Version } from "../../utils/Version";
import { Installer } from "../../utils/Installer";

export class MdPlugin {
  private readonly version: Version;
  private readonly repo: Repo;
  private readonly platform: NodeJS.Platform;
  private readonly loader: Loader;

  constructor(
    private readonly repoName: string,
    private readonly versionKey: string,
    private readonly binaryName: string,
    private readonly binaryPlatformName: string,
  ) {
    this.version = new Version(getInput(this.versionKey));
    this.repo = new Repo(this.repoName);
    this.platform = platform();
    this.loader = new Loader(this.repo, this.version, this.binaryPlatformName);
    this.validateOs();
  }

  private validateOs() {
    if (this.platform !== "linux") {
      throw new Error(
        `Unsupported operating system '${this.platform}'. This plugin supports only linux.`,
      );
    }
  }

  async setup(): Promise<void> {
    info("---------------------------");
    info(`[PLUGIN]: Setup ${this.repo} ${this.version.wanted}...`);
    const archivePath = await this.loader.downloadBinary();
    const installer = new Installer(
      archivePath,
      this.binaryName,
      this.loader.archiveType,
    );
    await installer.install();
  }
}
