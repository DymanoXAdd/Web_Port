/**
 * The error screen must never show the raw error message (it can leak internals such as
 * Sanity env-var names or stack details); visitors see one fixed sentence.
 */
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import * as Sentry from "@sentry/nextjs";

jest.mock("@sentry/nextjs", () => ({ captureException: jest.fn() }));

function Boom(): never {
  throw new Error("Missing Sanity env vars: NEXT_PUBLIC_SANITY_PROJECT_ID");
}

it("shows the fixed sentence, not error.message", () => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // React + the boundary log the throw
  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  );

  expect(screen.getByText("An unexpected error occurred. Please try refreshing the page.")).toBeInTheDocument();
  expect(screen.queryByText(/NEXT_PUBLIC_SANITY/)).not.toBeInTheDocument();
});

it("reports the caught error to Sentry", () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  );
  expect(Sentry.captureException).toHaveBeenCalledWith(
    expect.objectContaining({ message: expect.stringContaining("Missing Sanity env vars") }),
    expect.anything()
  );
});
