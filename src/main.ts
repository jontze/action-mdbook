import * as core from "@actions/core";
import { MdBook } from "./mdbook/MdBook";
import { Admonish } from "./mdbook/plugins/Admonish";
import { Linkcheck } from "./mdbook/plugins/Linkcheck";
import { Mermaid } from "./mdbook/plugins/Mermaid";
import { OpenGh } from "./mdbook/plugins/OpenGh";
import { Toc } from "./mdbook/plugins/Toc";

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

  // Admonish - 3rd party preprocessor plugin for mdbook to add material design
  if (core.getBooleanInput("use-Admonish") === true) {
    const admonishPlugin = new Admonish();
    await admonishPlugin.setup();
  }
};

(async (): Promise<void> => {
  try {
    await run();
  } catch (err: any) {
    core.setFailed(`${err.message}`);
  }
})();
