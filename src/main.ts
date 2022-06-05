import * as core from "@actions/core";
import { MdBook } from "./mdbook/MdBook";
import { Linkcheck } from "./mdbook/plugins/Linkcheck";
import { Mermaid } from "./mdbook/plugins/Mermaid";
import { OpenGh } from "./mdbook/plugins/OpenGh";
import { Toc } from "./mdbook/plugins/Toc";
import { SVGbob } from "./mdbook/plugins/SVGbob";

/**
 * Run the action async
 */
const run = async () => {
  const mdBook = new MdBook();
  await mdBook.setup();

  // Linkcheck - 3rd party backend plugin for mdbook
  if (core.getBooleanInput("use-linkcheck") === true) {
    const linkcheckPlugin = new Linkcheck();
    await linkcheckPlugin.setup();
  }

  // Mermaid - 3rd party preprocessor plugin for mdbook
  if (core.getBooleanInput("use-mermaid") === true) {
    const mermaidPlugin = new Mermaid();
    await mermaidPlugin.setup();
  }

  // Toc - 3rd party preprocessor plugin for mdbook
  if (core.getBooleanInput("use-toc") === true) {
    const tocPlugin = new Toc();
    await tocPlugin.setup();
  }

  // Open-On-Gh - 3rd party preprocessor plugin for mdbook
  if (core.getBooleanInput("use-opengh") === true) {
    const openGhPlugin = new OpenGh();
    await openGhPlugin.setup();
  }

  // SVGBob - converts line diagrams to svg
  if (core.getBooleanInput("use-svgbob") === true) {
    const SVGbobPlugin = new SVGbob();
    await SVGbobPlugin.setup();
  }


};

(async (): Promise<void> => {
  try {
    await run();
  } catch (err: any) {
    core.setFailed(`${err.message}`);
  }
})();
