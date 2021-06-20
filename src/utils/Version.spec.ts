import { Version } from "./Version";

describe("Version", () => {
  it("should init Version class", () => {
    const version = new Version("v1.0.0");
    expect(version).toBeDefined();
  });

  it("should find the best version", () => {
    let versions = [
      "v0.4.2-beta.2",
      "v0.4.1",
      "v0.4.0",
      "v0.3.7",
      "v0.3.6",
      "v0.3.5",
    ];
    const v = new Version("~0.3.4");
    expect(v.findMaxStatisfyingVersion(versions)).toBe("v0.3.7");
  });

  it("should throw error if no version found", () => {
    let versions = [
      "v0.4.2-beta.2",
      "v0.4.1",
      "v0.4.0",
      "v0.3.7",
      "v0.3.6",
      "v0.3.5",
    ];
    const v = new Version("~0.5.4");
    expect(() => v.findMaxStatisfyingVersion(versions)).toThrowError();
  });
});
