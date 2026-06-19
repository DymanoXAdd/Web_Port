/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Unit tests: no server needed
  testMatch: ["**/__tests__/unit/**/*.test.ts"],
  moduleNameMapper: {
    // Resolve the @/ alias used throughout the project
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          // Relax for tests — we don't need strict Next.js bundler resolution
          moduleResolution: "node",
          esModuleInterop: true,
        },
      },
    ],
  },
  collectCoverageFrom: [
    "lib/**/*.ts",
    "app/api/**/*.ts",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageReporters: ["text", "lcov"],
};

module.exports = config;
