/** @type {import('jest').Config} */
// Component/UI tests — run in jsdom with Testing Library.
// Kept separate from jest.config.js (node env, logic tests) so neither breaks the other.
const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/components/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // @/ path alias used across the project
    "^@/(.*)$": "<rootDir>/$1",
    // Stub CSS/SCSS imports
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    // Stub static assets (images, fonts, etc.)
    "\\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          moduleResolution: "node",
          esModuleInterop: true,
        },
      },
    ],
  },
};

module.exports = config;
