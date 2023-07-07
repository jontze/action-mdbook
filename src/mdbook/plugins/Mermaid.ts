import { MdPlugin } from "./MdPlugin";

export class Mermaid extends MdPlugin {
  constructor() {
    super(
      "badboy/mdbook-mermaid",
      "mermaid-version",
      "mdbook-mermaid",
      "unknown-linux-gnu",
    );
  }
}
