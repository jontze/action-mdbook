import { MdPlugin } from "./MdPlugin";

export class Linkcheck extends MdPlugin {
  constructor() {
    super(
      "marxin/mdbook-linkcheck2",
      "linkcheck-version",
      "mdbook-linkcheck2",
      "unknown-linux-gnu",
    );
  }
}
