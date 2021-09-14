"use strict";
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
exports.Loader = void 0;
const core_1 = require("@actions/core");
const tool_cache_1 = require("@actions/tool-cache");
const path_1 = require("path");
const typings_1 = require("../typings");
class Loader {
    constructor(repo, version, binaryPlatformString) {
        this.repo = repo;
        this.version = version;
        this.binaryPlatformString = binaryPlatformString;
    }
    downloadBinary() {
        return __awaiter(this, void 0, void 0, function* () {
            let downloadUrl;
            if (this.version.wanted === "latest") {
                // Download latest release
                downloadUrl = yield this.getLatestDownloadUrl();
            }
            else {
                // Download statisfying version release with a binary
                downloadUrl = yield this.getDownloadUrlByRelease();
            }
            this.archiveType = this.extractArchiveType(downloadUrl);
            (0, core_1.info)(`Download ${this.repo} binary from ${downloadUrl}`);
            return (0, tool_cache_1.downloadTool)(downloadUrl);
        });
    }
    extractArchiveType(fileName) {
        const fileType = (0, path_1.extname)(fileName);
        switch (fileType) {
            case ".zip":
                return typings_1.ARCHIVE_TYPE.ZIP;
            case ".7z":
                return typings_1.ARCHIVE_TYPE.SEVENZ;
            case ".xar":
                return typings_1.ARCHIVE_TYPE.XAR;
            case ".tar":
            case ".gz":
                return typings_1.ARCHIVE_TYPE.TAR;
            default:
                throw new Error("Unsupported archive type");
        }
    }
    getLatestDownloadUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadUrl = (yield this.repo.getLatestRelease()).assets.find((asset) => asset.browser_download_url.includes(this.binaryPlatformString));
            if (downloadUrl == null) {
                // Fetch all releases and use the latest release with a matching binary
                (0, core_1.warning)("The latest release doesn't include a valid binary...");
                (0, core_1.warning)("Searching for older release...");
                let version = null;
                const releases = yield this.repo.getReleases();
                releases.forEach((release) => {
                    if (version == null &&
                        release.prerelease === false &&
                        release.assets.length !== 0 &&
                        release.assets.find((asset) => asset.browser_download_url.includes(this.binaryPlatformString))) {
                        version = release.tag_name;
                    }
                });
                if (version == null) {
                    throw new Error("No release found with a matching linux binary");
                }
                (0, core_1.info)(`Latest version with a valid release binary is: ${version}`);
                const downloadUrlLatestValidRelease = (yield this.repo.getReleaseByTag(version)).assets.find((asset) => asset.browser_download_url.includes(this.binaryPlatformString));
                if (downloadUrlLatestValidRelease == null) {
                    throw new Error("Download url not found!");
                }
                return downloadUrlLatestValidRelease.browser_download_url;
            }
            return downloadUrl.browser_download_url;
        });
    }
    getDownloadUrlByRelease() {
        return __awaiter(this, void 0, void 0, function* () {
            const releases = yield this.repo.getReleases();
            const versions = [];
            releases.forEach((release) => {
                if (release.prerelease === false &&
                    release.assets.length !== 0 &&
                    release.assets.find((asset) => asset.browser_download_url.includes(this.binaryPlatformString))) {
                    versions.push(release.tag_name);
                }
            });
            const choosedVersion = this.version.findMaxStatisfyingVersion(versions);
            (0, core_1.info)(`Latest statisfying version is: ${choosedVersion}`);
            const downloadUrl = (yield this.repo.getReleaseByTag(choosedVersion)).assets.find((asset) => asset.browser_download_url.includes(this.binaryPlatformString));
            if (downloadUrl == null) {
                throw new Error("Download url not found!");
            }
            return downloadUrl.browser_download_url;
        });
    }
}
exports.Loader = Loader;
