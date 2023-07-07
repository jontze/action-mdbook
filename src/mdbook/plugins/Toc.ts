import { MdPlugin } from "./MdPlugin";

export class Toc extends MdPlugin {
  constructor() {
    super(
      "badboy/mdbook-toc",
      "toc-version",
      "mdbook-toc",
      "unknown-linux-musl",
    );
  }
}
