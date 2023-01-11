"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toc = void 0;
const MdPlugin_1 = require("./MdPlugin");
class Toc extends MdPlugin_1.MdPlugin {
    constructor() {
        super("badboy/mdbook-toc", "toc-version", "mdbook-toc", "unknown-linux-musl");
    }
}
exports.Toc = Toc;
