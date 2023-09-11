"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admonish = void 0;
const MdPlugin_1 = require("./MdPlugin");
class Admonish extends MdPlugin_1.MdPlugin {
    constructor() {
        super("tommilligan/mdbook-admonish", "admonish-version", "mdbook-admonish", "x86_64-unknown-linux-musl");
    }
}
exports.Admonish = Admonish;
