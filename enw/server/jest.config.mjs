// server/jest.config.mjs
export default {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.test.js",
    "**/__tests__/**/*.spec.js",
    "**/__tests__/**/*.test.mjs",
  ],
  // برای ESM نیازی به transform نیست
  transform: {},
  // ⚠️ extensionsToTreatAsEsm لازم نیست وقتی "type":"module" داری
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/__tests__/**",
    "!src/**/seeds/**",
  ],

  // ⬇️ Added to ensure test DB setup runs before tests
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.mjs"],

  // ⬇️ Added to avoid 5s timeouts on slower DB ops
  testTimeout: 20000,
};
