import { MdPlugin } from "./MdPlugin";

export class Katex extends MdPlugin {
  constructor() {
    super(
      "lzanini/mdbook-katex",
      "katex-version",
      "mdbook-katex",
      "unknown-linux-musl"
    );
  }
}
