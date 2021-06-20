module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec).[jt]s?(x)"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/main.ts"],
  coveragePathIgnorePatterns: ["node_modules", "dist", "lib"],
};
