"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repo = void 0;
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
class Repo {
    constructor(repository) {
        [this.owner, this.project] = repository.split("/");
        if (this.owner == null || this.owner === "") {
            throw new Error("Repository owner not defined");
        }
        if (this.project == null || this.project === "") {
            throw new Error("Projekt name not defined");
        }
        this.token = core.getInput("token");
        if (this.token == null || this.token === "") {
            throw new Error("GitHub token not found");
        }
        this.octokit = github.getOctokit(this.token);
    }
    getReleases() {
        return __awaiter(this, void 0, void 0, function* () {
            const resReleases = yield this.octokit.rest.repos.listReleases({
                owner: this.owner,
                repo: this.project,
            });
            if (resReleases.status !== 200) {
                throw new Error(`Request to list of releases of ${this.owner}/${this.project} failed with status code ${resReleases.status}`);
            }
            return resReleases.data;
        });
    }
    getLatestRelease() {
        return __awaiter(this, void 0, void 0, function* () {
            const resLatestRelease = yield this.octokit.rest.repos.getLatestRelease({
                owner: this.owner,
                repo: this.project,
            });
            if (resLatestRelease.status !== 200) {
                throw new Error(`Request to latest release of ${this.owner}/${this.project} failed with status code ${resLatestRelease.status}`);
            }
            return resLatestRelease.data;
        });
    }
    getReleaseByTag(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const resTagRelease = yield this.octokit.rest.repos.getReleaseByTag({
                owner: this.owner,
                repo: this.project,
                tag,
            });
            if (resTagRelease.status !== 200) {
                throw new Error(`Request to release of tag '${tag}' of ${this.owner}/${this.project} failed with status code ${resTagRelease.status}`);
            }
            return resTagRelease.data;
        });
    }
}
exports.Repo = Repo;
