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
exports.run = void 0;
const core_1 = require("@actions/core");
const MdBook_1 = require("./MdBook");
const Admonish_1 = require("./plugins/Admonish");
const Katex_1 = require("./plugins/Katex");
const Linkcheck_1 = require("./plugins/Linkcheck");
const Mermaid_1 = require("./plugins/Mermaid");
const OpenGh_1 = require("./plugins/OpenGh");
const Toc_1 = require("./plugins/Toc");
/**
 * Run the action async
 */
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const mdBook = new MdBook_1.MdBook();
    yield mdBook.setup();
    // Linkcheck - 3rd party backend plugin for mdbook
    if ((0, core_1.getBooleanInput)("use-linkcheck") === true) {
        const linkcheckPlugin = new Linkcheck_1.Linkcheck();
        yield linkcheckPlugin.setup();
    }
    // Mermaid - 3rd party preprocessor plugin for mdbook
    if ((0, core_1.getBooleanInput)("use-mermaid") === true) {
        const mermaidPlugin = new Mermaid_1.Mermaid();
        yield mermaidPlugin.setup();
    }
    // Toc - 3rd party preprocessor plugin for mdbook
    if ((0, core_1.getBooleanInput)("use-toc") === true) {
        const tocPlugin = new Toc_1.Toc();
        yield tocPlugin.setup();
    }
    // Open-On-Gh - 3rd party preprocessor plugin for mdbook
    if ((0, core_1.getBooleanInput)("use-opengh") === true) {
        const openGhPlugin = new OpenGh_1.OpenGh();
        yield openGhPlugin.setup();
    }
    // Admonish - 3rd party preprocessor plugin for mdbook to add material design
    if ((0, core_1.getBooleanInput)("use-admonish") === true) {
        const admonishPlugin = new Admonish_1.Admonish();
        yield admonishPlugin.setup();
    }
    // Katex - 3rd party preprocessor plugin for mdbook rendering LaTex equations to HTML at build time
    if ((0, core_1.getBooleanInput)("use-katex") === true) {
        const katexPlugin = new Katex_1.Katex();
        yield katexPlugin.setup();
    }
});
exports.run = run;
