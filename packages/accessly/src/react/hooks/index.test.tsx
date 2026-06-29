import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { PermissionProvider } from "../provider";
import { usePermission, useAccessDecision, useAccessModel } from "./index";

function PermissionCheck({ permission }: { permission: string }) {
  const allowed = usePermission(permission);
  return <div data-testid="result">{allowed ? "allowed" : "denied"}</div>;
}

function ResultCheck({ permission }: { permission: string }) {
  const result = useAccessDecision(permission);
  return (
    <div>
      <span data-testid="allowed">{result.allowed ? "yes" : "no"}</span>
      <span data-testid="reason">{result.reason}</span>
    </div>
  );
}

function AccessCheck() {
  const model = useAccessModel();
  return <div data-testid="model">{model ? "exists" : "none"}</div>;
}

function LoadingAccessCheck() {
  const model = useAccessModel();
  return (
    <div data-testid="loading-model">
      {model ? (model.isLoading ? "loading" : "loaded") : "null"}
    </div>
  );
}

describe("usePermission", () => {
  it("returns true for allowed permission", () => {
    render(
      <PermissionProvider access={{ permissions: ["users.create"] }}>
        <PermissionCheck permission="users.create" />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("result").textContent).toBe("allowed");
  });

  it("returns false for denied permission", () => {
    render(
      <PermissionProvider access={{ permissions: ["users.create"] }}>
        <PermissionCheck permission="users.delete" />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("result").textContent).toBe("denied");
  });
});

describe("useAccessDecision", () => {
  it("returns full decision object", () => {
    render(
      <PermissionProvider access={{ permissions: ["users.create"] }}>
        <ResultCheck permission="users.create" />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("allowed").textContent).toBe("yes");
    expect(screen.getByTestId("reason").textContent).toBe("allowed");
  });

  it("returns denied decision for missing permission", () => {
    render(
      <PermissionProvider access={{ permissions: ["users.create"] }}>
        <ResultCheck permission="users.delete" />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("allowed").textContent).toBe("no");
    expect(screen.getByTestId("reason").textContent).toBe("missing_permission");
  });
});

describe("useAccessModel", () => {
  it("returns the access model", () => {
    render(
      <PermissionProvider access={{ permissions: ["users.create"] }}>
        <AccessCheck />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("model").textContent).toBe("exists");
  });

  it("returns null when no model", () => {
    render(
      <PermissionProvider>
        <AccessCheck />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("model").textContent).toBe("none");
  });

  it("returns loading model when loading prop is true", () => {
    render(
      <PermissionProvider access={{ permissions: ["users.create"] }} loading>
        <LoadingAccessCheck />
      </PermissionProvider>,
    );
    expect(screen.getByTestId("loading-model").textContent).toBe("loading");
  });

  it("returns null when loading prop is true but no model", () => {
    render(
      <PermissionProvider loading>
        <LoadingAccessCheck />
      </PermissionProvider>,
    );
    // With loading=true and no model, getModel returns LOADING_MODEL
    expect(screen.getByTestId("loading-model").textContent).toBe("loading");
  });
});
