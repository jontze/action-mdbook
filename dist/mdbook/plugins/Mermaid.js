"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mermaid = void 0;
const MdPlugin_1 = require("./MdPlugin");
class Mermaid extends MdPlugin_1.MdPlugin {
    constructor() {
        super("badboy/mdbook-mermaid", "mermaid-version", "mdbook-mermaid", "unknown-linux-gnu");
    }
}
exports.Mermaid = Mermaid;
