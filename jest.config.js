/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Using jsdom for browser-like environment
  moduleNameMapper: {
    // Handle path aliases if you have any in tsconfig.json
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.app.json", // Use the app config that has JSX config
        jsx: "react-jsx",
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFiles: [
    "<rootDir>/jest.setup.js", // Setup file for global mocks
  ],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/test/**"],
};
