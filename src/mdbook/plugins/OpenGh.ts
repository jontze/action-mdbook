import { MdPlugin } from "./MdPlugin";

export class OpenGh extends MdPlugin {
  constructor() {
    super(
      "badboy/mdbook-open-on-gh",
      "opengh-version",
      "mdbook-open-on-gh",
      "x86_64-unknown-linux-musl",
    );
  }
}
