import * as gh from "@actions/github";
import * as core from "@actions/core";
import { MdBook } from "./mdbook/MdBook";
import { Linkcheck } from "./mdbook/plugins/Linkcheck";

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

  // TODO: Epub - 3rd party backend plugin for mdbook
  if (core.getBooleanInput("use-epub") === true) {
    // use epub
  }

  // TODO: Katex - 3rd party preprocessor plugin for mdbook
  if (core.getBooleanInput("use-katex") === true) {
    // use KAtex plugin
  }
};

(async (): Promise<void> => {
  try {
    await run();
  } catch (err) {
    core.setFailed(`${err.message}`);
  }
})();
