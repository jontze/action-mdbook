"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Katex = void 0;
const MdPlugin_1 = require("./MdPlugin");
class Katex extends MdPlugin_1.MdPlugin {
    constructor() {
        super("lzanini/mdbook-katex", "katex-version", "mdbook-katex", "unknown-linux-musl");
    }
}
exports.Katex = Katex;
