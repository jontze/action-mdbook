"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
const semver_1 = __importDefault(require("semver"));
class Version {
    constructor(version) {
        this.wanted = version.replace("v", "");
    }
    findMaxStatisfyingVersion(versions) {
        const maxVersion = semver_1.default.maxSatisfying(versions, this.wanted);
        if (maxVersion == null) {
            throw new Error(`No statisfying version found for your input of '${this.wanted}'`);
        }
        return maxVersion;
    }
}
exports.Version = Version;
