import { addPath, info } from "@actions/core";
import {
  extractTar,
  extract7z,
  extractZip,
  extractXar,
} from "@actions/tool-cache";
import { constants, accessSync, chmodSync } from "fs";
import { ARCHIVE_TYPE } from "../typings";

export class Installer {
  constructor(
    private readonly downloadPath: string,
    private readonly binaryName: string,
    private readonly archiveType?: ARCHIVE_TYPE,
  ) {}

  private async extractArchive(): Promise<string> {
    switch (this.archiveType) {
      case ARCHIVE_TYPE.TAR:
        return extractTar(this.downloadPath);
      case ARCHIVE_TYPE.ZIP:
        return extractZip(this.downloadPath);
      case ARCHIVE_TYPE.SEVENZ:
        return extract7z(this.downloadPath);
      case ARCHIVE_TYPE.XAR:
        return extractXar(this.downloadPath);
      default:
        throw new Error(`Unkown archive type '${this.archiveType}'`);
    }
  }

  async install(): Promise<void> {
    const extractedPath = await this.extractArchive();
    const binaryPath = `${extractedPath}/${this.binaryName}`;
    try {
      accessSync(binaryPath, constants.X_OK);
    } catch (err: any) {
      info("File not executable! Changing permissions...");
      chmodSync(binaryPath, 0o100);
    }
    addPath(extractedPath);
    info(`${this.binaryName} extracted and added to path`);
  }
}
