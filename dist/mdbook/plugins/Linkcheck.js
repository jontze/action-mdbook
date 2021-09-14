"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Linkcheck = void 0;
const MdPlugin_1 = require("./MdPlugin");
class Linkcheck extends MdPlugin_1.MdPlugin {
    constructor() {
        super("Michael-F-Bryan/mdbook-linkcheck", "linkcheck-version", "mdbook-linkcheck", "unknown-linux-gnu");
    }
}
exports.Linkcheck = Linkcheck;
