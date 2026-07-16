// Loaded before each component test. Adds jest-dom matchers (toBeInTheDocument, etc.).
import "@testing-library/jest-dom";

// jsdom does not implement window.matchMedia. Some components/libraries read it,
// so provide a minimal stub to avoid runtime errors in tests.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
