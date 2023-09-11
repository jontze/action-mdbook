import { MdPlugin } from "./MdPlugin";

export class Toc extends MdPlugin {
  constructor() {
    super(
      "badboy/mdbook-toc",
      "toc-version",
      "mdbook-toc",
      "x86_64-unknown-linux-musl",
    );
  }
}
