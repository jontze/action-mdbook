import { setFailed } from "@actions/core";
import { run } from "./mdbook";

(async (): Promise<void> => {
  try {
    await run();
  } catch (err: any) {
    setFailed(`${err.message}`);
  }
})();
