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
exports.Installer = void 0;
const core_1 = require("@actions/core");
const tool_cache_1 = require("@actions/tool-cache");
const fs_1 = require("fs");
const typings_1 = require("../typings");
class Installer {
    constructor(downloadPath, binaryName, archiveType) {
        this.downloadPath = downloadPath;
        this.binaryName = binaryName;
        this.archiveType = archiveType;
    }
    extractArchive() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.archiveType) {
                case typings_1.ARCHIVE_TYPE.TAR:
                    return (0, tool_cache_1.extractTar)(this.downloadPath);
                case typings_1.ARCHIVE_TYPE.ZIP:
                    return (0, tool_cache_1.extractZip)(this.downloadPath);
                case typings_1.ARCHIVE_TYPE.SEVENZ:
                    return (0, tool_cache_1.extract7z)(this.downloadPath);
                case typings_1.ARCHIVE_TYPE.XAR:
                    return (0, tool_cache_1.extractXar)(this.downloadPath);
                default:
                    throw new Error(`Unkown archive type '${this.archiveType}'`);
            }
        });
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            const extractedPath = yield this.extractArchive();
            const binaryPath = `${extractedPath}/${this.binaryName}`;
            try {
                (0, fs_1.accessSync)(binaryPath, fs_1.constants.X_OK);
            }
            catch (err) {
                (0, core_1.info)("File not executable! Changing permissions...");
                (0, fs_1.chmodSync)(binaryPath, 0o100);
            }
            (0, core_1.addPath)(extractedPath);
            (0, core_1.info)(`${this.binaryName} extracted and added to path`);
        });
    }
}
exports.Installer = Installer;
