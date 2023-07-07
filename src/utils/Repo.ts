import { getOctokit } from "@actions/github";
import { getInput } from "@actions/core";
import { Octokit } from "@octokit/core";
import { PaginateInterface } from "@octokit/plugin-paginate-rest";
import { Api } from "@octokit/plugin-rest-endpoint-methods/dist-types/types";

type GhOctoKit = Octokit & Api & { paginate: PaginateInterface };

export class Repo {
  private readonly token?: string;
  private readonly octokit: GhOctoKit;
  readonly owner: string;
  readonly project: string;

  constructor(repository: string) {
    [this.owner, this.project] = repository.split("/");
    if (this.owner == null || this.owner === "") {
      throw new Error("Repository owner not defined");
    }
    if (this.project == null || this.project === "") {
      throw new Error("Projekt name not defined");
    }

    this.token = getInput("token");
    if (this.token == null || this.token === "") {
      throw new Error("GitHub token not found");
    }
    this.octokit = getOctokit(this.token);
  }

  toString(): string {
    return `${this.owner}/${this.project}`;
  }

  async getReleases() {
    const resReleases = await this.octokit.rest.repos.listReleases({
      owner: this.owner,
      repo: this.project,
    });
    if (resReleases.status !== 200) {
      throw new Error(
        `Request to list of releases of ${this.owner}/${this.project} failed with status code ${resReleases.status}`,
      );
    }
    return resReleases.data;
  }

  async getLatestRelease() {
    const resLatestRelease = await this.octokit.rest.repos.getLatestRelease({
      owner: this.owner,
      repo: this.project,
    });
    if (resLatestRelease.status !== 200) {
      throw new Error(
        `Request to latest release of ${this.owner}/${this.project} failed with status code ${resLatestRelease.status}`,
      );
    }
    return resLatestRelease.data;
  }

  async getReleaseByTag(tag: string) {
    const resTagRelease = await this.octokit.rest.repos.getReleaseByTag({
      owner: this.owner,
      repo: this.project,
      tag,
    });
    if (resTagRelease.status !== 200) {
      throw new Error(
        `Request to release of tag '${tag}' of ${this.owner}/${this.project} failed with status code ${resTagRelease.status}`,
      );
    }
    return resTagRelease.data;
  }
}
