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
exports.MdBook = void 0;
const core_1 = require("@actions/core");
const os_1 = require("os");
const Installer_1 = require("../utils/Installer");
const Loader_1 = require("../utils/Loader");
const Repo_1 = require("../utils/Repo");
const Version_1 = require("../utils/Version");
class MdBook {
    constructor() {
        this.version = new Version_1.Version((0, core_1.getInput)("mdbook-version"));
        this.repo = new Repo_1.Repo("rust-lang/mdBook");
        this.platform = (0, os_1.platform)();
        this.loader = new Loader_1.Loader(this.repo, this.version, "unknown-linux-gnu");
        this.validateOs();
    }
    validateOs() {
        if (this.platform !== "linux") {
            throw new Error(`Unsupported operating system '${this.platform}'. This action supports only linux.`);
        }
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, core_1.info)(`Setup mdBook ${this.version.wanted}...`);
            const archivePath = yield this.loader.downloadBinary();
            const installer = new Installer_1.Installer(archivePath, "mdbook", this.loader.archiveType);
            yield installer.install();
        });
    }
}
exports.MdBook = MdBook;
