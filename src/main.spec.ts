import * as core from "@actions/core";
import * as mainModule from "./mdbook";

jest.mock("./mdbook");

describe("Main", () => {
  it("should execute action", () => {
    const spyRun = jest.spyOn(mainModule, "run");
    require("./main");
    expect(spyRun).toBeCalledTimes(1);
  });
});
