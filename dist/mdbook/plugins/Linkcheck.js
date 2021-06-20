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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Linkcheck = void 0;
const os_1 = __importDefault(require("os"));
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
const Repo_1 = require("../../utils/Repo");
const Version_1 = require("../../utils/Version");
class Linkcheck {
    constructor() {
        this.version = new Version_1.Version(core.getInput("linkcheck-version"));
        this.repo = new Repo_1.Repo("Michael-F-Bryan/mdbook-linkcheck");
        this.platform = os_1.default.platform();
        this.validateOs();
    }
    validateOs() {
        if (this.platform !== "linux") {
            throw new Error(`Unsupported operating system '${this.platform}. This action supports only linux.'`);
        }
    }
    getDownloadUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.version.wanted === "latest") {
                // Download latest release
                const downloadUrl = (yield this.repo.getLatestRelease()).assets.find((asset) => asset.browser_download_url.includes("unknown-linux-gnu"));
                if (downloadUrl == null) {
                    throw new Error("Download url not found!");
                }
                return downloadUrl.browser_download_url;
            }
            else {
                // Download statisfying version release with a binary
                const releases = yield this.repo.getReleases();
                const versions = [];
                releases.forEach((release) => {
                    if (release.prerelease === false &&
                        release.assets.length !== 0 &&
                        release.assets.find((asset) => asset.browser_download_url.includes("unknown-linux-gnu"))) {
                        versions.push(release.tag_name);
                    }
                });
                const choosedVersion = this.version.findMaxStatisfyingVersion(versions);
                core.info(`Latest statisfying version is: ${choosedVersion}`);
                const downloadUrl = (yield this.repo.getReleaseByTag(choosedVersion)).assets.find((asset) => asset.browser_download_url.includes("unknown-linux-gnu"));
                if (downloadUrl == null) {
                    throw new Error("Download url not found!");
                }
                return downloadUrl.browser_download_url;
            }
        });
    }
    install(url) {
        return __awaiter(this, void 0, void 0, function* () {
            core.info(`Download linkcheck binary from ${url}`);
            const downloadPath = yield tc.downloadTool(url);
            let binPath;
            if (url.endsWith(".zip")) {
                binPath = yield tc.extractZip(downloadPath);
            }
            else {
                binPath = yield tc.extractTar(downloadPath);
            }
            const exitCode = yield exec.exec("chmod", [
                "+x",
                `${binPath}/mdbook-linkcheck`,
            ]);
            if (exitCode !== 0) {
                throw new Error(`Could not convert mdbook-linkcheck binary to executable, failed with exit code ${exitCode}`);
            }
            core.addPath(binPath);
            core.info("mdbook-linkcheck extracted and added to path");
        });
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            core.info(`Setup mdbook-linkcheck ${this.version.wanted}...`);
            const url = yield this.getDownloadUrl();
            yield this.install(url);
        });
    }
}
exports.Linkcheck = Linkcheck;
