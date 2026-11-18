/**
 * The privacy policy says error reports carry no IP, cookies, headers or form contents.
 * Sentry 11 collects all of those by default, so both inits must switch them off (T-036).
 */
const init = jest.fn();
jest.mock("@sentry/nextjs", () => ({ init, captureRouterTransitionStart: jest.fn() }));

const privateData = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
  stackFrameVariables: false,
};

beforeEach(() => init.mockClear());

it("server Sentry collects no personal or request data", async () => {
  const { register } = await import("@/instrumentation");
  await register();
  expect(init).toHaveBeenCalledWith(expect.objectContaining({ dataCollection: privateData }));
});

it("browser Sentry collects no personal or request data", async () => {
  jest.isolateModules(() => require("@/instrumentation-client"));
  expect(init).toHaveBeenCalledWith(expect.objectContaining({ dataCollection: privateData }));
});
