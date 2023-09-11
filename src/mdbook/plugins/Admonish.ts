import { MdPlugin } from "./MdPlugin";

export class Admonish extends MdPlugin {
  constructor() {
    super(
      "tommilligan/mdbook-admonish",
      "admonish-version",
      "mdbook-admonish",
      "x86_64-unknown-linux-musl",
    );
  }
}
