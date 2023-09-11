"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenGh = void 0;
const MdPlugin_1 = require("./MdPlugin");
class OpenGh extends MdPlugin_1.MdPlugin {
    constructor() {
        super("badboy/mdbook-open-on-gh", "opengh-version", "mdbook-open-on-gh", "x86_64-unknown-linux-musl");
    }
}
exports.OpenGh = OpenGh;
