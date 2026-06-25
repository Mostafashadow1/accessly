import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { PermissionProvider, useAccessContext } from "./index";
import { useAccessModel } from "../hooks";
import type { AccessAdapter } from "../types/access";

function TestConsumer() {
  const ctx = useAccessContext();
  return (
    <div>
      <span data-testid="model">{ctx.model ? "has-model" : "no-model"}</span>
      <span data-testid="loading">
        {ctx.loading ? "loading" : "not-loading"}
      </span>
    </div>
  );
}

function AccessDisplay() {
  const access = useAccessModel();
  return (
    <div data-testid="access">
      {access ? JSON.stringify(access.permissions) : "null"}
    </div>
  );
}

describe("PermissionProvider", () => {
  it("renders children", () => {
    render(
      <PermissionProvider>
        <div>hello</div>
      </PermissionProvider>,
    );
    expect(screen.getByText("hello")).not.toBeNull();
  });

  it("provides access model via context", () => {
    render(
      <PermissionProvider access={{ permissions: ["users.create"] }}>
        <TestConsumer />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("model").textContent).toBe("has-model");
  });

  it("provides null model when no access or source", () => {
    render(
      <PermissionProvider>
        <TestConsumer />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("model").textContent).toBe("no-model");
  });

  it("reflects loading state", () => {
    render(
      <PermissionProvider loading>
        <TestConsumer />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("loading").textContent).toBe("loading");
  });

  it("normalizes source via adapter", () => {
    const adapter: AccessAdapter<unknown> = {
      normalize: (source: unknown) => {
        const { perms } = source as { perms: string[] };
        return { permissions: perms };
      },
    };
    render(
      <PermissionProvider source={{ perms: ["a", "b"] }} adapter={adapter}>
        <AccessDisplay />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("access").textContent).toContain("a");
    expect(screen.getByTestId("access").textContent).toContain("b");
  });

  it("access takes precedence over source", () => {
    const adapter: AccessAdapter<unknown> = {
      normalize: () => ({ permissions: ["from-adapter"] }),
    };
    render(
      <PermissionProvider
        access={{ permissions: ["from-access"] }}
        source={{}}
        adapter={adapter}
      >
        <AccessDisplay />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("access").textContent).toContain("from-access");
    expect(screen.getByTestId("access").textContent).not.toContain(
      "from-adapter",
    );
  });
});

describe("useAccessContext", () => {
  it("throws when used outside provider", () => {
    // The error from useAccessContext is caught by React's error handling.
    // We verify it's thrown by wrapping in a component that catches it.
    function ErrorCatcher() {
      try {
        useAccessContext();
      } catch (e) {
        return <div>{(e as Error).message}</div>;
      }
      return <div>no-error</div>;
    }
    render(<ErrorCatcher />);
    expect(
      screen.getByText(/usePermission hooks must be used inside/),
    ).not.toBeNull();
  });
});
