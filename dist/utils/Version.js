"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
const semver_1 = require("semver");
class Version {
    constructor(version) {
        this.wanted = version.replace("v", "");
    }
    findMaxStatisfyingVersion(versions) {
        const maxVersion = (0, semver_1.maxSatisfying)(versions, this.wanted);
        if (maxVersion == null) {
            throw new Error(`No statisfying version found for your input of '${this.wanted}'`);
        }
        return maxVersion;
    }
}
exports.Version = Version;
