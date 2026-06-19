/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Integration tests: requires a running dev server
  testMatch: ["**/__tests__/integration/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          moduleResolution: "node",
          esModuleInterop: true,
        },
      },
    ],
  },
  // Give the server time to respond
  testTimeout: 15000,
};

module.exports = config;
