import { getBooleanInput } from "@actions/core";
import { MdBook } from "./MdBook";
import { Admonish } from "./plugins/Admonish";
import { Linkcheck } from "./plugins/Linkcheck";
import { Mermaid } from "./plugins/Mermaid";
import { OpenGh } from "./plugins/OpenGh";
import { Toc } from "./plugins/Toc";

/**
 * Run the action async
 */
export const run = async () => {
  const mdBook = new MdBook();
  await mdBook.setup();

  // Linkcheck - 3rd party backend plugin for mdbook
  if (getBooleanInput("use-linkcheck") === true) {
    const linkcheckPlugin = new Linkcheck();
    await linkcheckPlugin.setup();
  }

  // Mermaid - 3rd party preprocessor plugin for mdbook
  if (getBooleanInput("use-mermaid") === true) {
    const mermaidPlugin = new Mermaid();
    await mermaidPlugin.setup();
  }

  // Toc - 3rd party preprocessor plugin for mdbook
  if (getBooleanInput("use-toc") === true) {
    const tocPlugin = new Toc();
    await tocPlugin.setup();
  }

  // Open-On-Gh - 3rd party preprocessor plugin for mdbook
  if (getBooleanInput("use-opengh") === true) {
    const openGhPlugin = new OpenGh();
    await openGhPlugin.setup();
  }

  // Admonish - 3rd party preprocessor plugin for mdbook to add material design
  if (getBooleanInput("use-admonish") === true) {
    const admonishPlugin = new Admonish();
    await admonishPlugin.setup();
  }
};
