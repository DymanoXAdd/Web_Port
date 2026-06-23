/**
 * Smoke test — proves the component-test stack works:
 * jsdom environment + @testing-library/react render/query + jest-dom matchers.
 * Real component tests for pages/components go in this __tests__/components/ folder.
 */
import { render, screen } from "@testing-library/react";

function Hello({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

describe("component-test stack smoke test", () => {
  it("renders a component and finds it in the jsdom document", () => {
    render(<Hello name="Luis" />);
    expect(
      screen.getByRole("heading", { name: /hello, luis/i })
    ).toBeInTheDocument();
  });
});
