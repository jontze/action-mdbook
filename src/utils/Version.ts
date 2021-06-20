import semver from "semver";

export class Version {
  public wanted: string;

  constructor(version: string) {
    this.wanted = version.replace("v", "");
  }

  findMaxStatisfyingVersion(versions: string[]): string {
    const maxVersion = semver.maxSatisfying(versions, this.wanted);
    if (maxVersion == null) {
      throw new Error(
        `No statisfying version found for your input of '${this.wanted}'`
      );
    }
    return maxVersion;
  }
}
