import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  setupFiles: ["jest-fetch-mock/setupJest"],
  testMatch: ["**/*.test.ts"],
};

export default config;
