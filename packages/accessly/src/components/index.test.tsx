import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { PermissionProvider } from "../provider";
import { Can, Cannot, ProtectedRoute } from "./index";

function renderWithAccess(ui: React.ReactElement, permissions: string[] = []) {
  return render(
    <PermissionProvider access={{ permissions }}>
      {ui}
    </PermissionProvider>,
  );
}

describe("Can", () => {
  it("renders children when allowed", () => {
    renderWithAccess(
      <Can permission="users.create">
        <button>Create User</button>
      </Can>,
      ["users.create"],
    );
    expect(screen.getByText("Create User")).not.toBeNull();
  });

  it("renders nothing when denied", () => {
    renderWithAccess(
      <Can permission="users.create">
        <button>Create User</button>
      </Can>,
      [],
    );
    expect(screen.queryByText("Create User")).toBeNull();
  });

  it("renders fallback when denied", () => {
    renderWithAccess(
      <Can permission="users.delete" fallback={<span>No access</span>}>
        <button>Delete</button>
      </Can>,
      [],
    );
    expect(screen.getByText("No access")).not.toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
  });

  it("supports render prop children", () => {
    renderWithAccess(
      <Can permission="users.create">
        {(decision) => (
          <div data-testid="decision">
            {decision.allowed ? "allowed" : "denied"}
          </div>
        )}
      </Can>,
      ["users.create"],
    );
    expect(screen.getByTestId("decision").textContent).toBe("allowed");
  });

  it("supports object permission input", () => {
    renderWithAccess(
      <Can permission={{ any: ["users.create", "users.delete"] }}>
        <span>Has access</span>
      </Can>,
      ["users.create"],
    );
    expect(screen.getByText("Has access")).not.toBeNull();
  });

  it("supports flag check", () => {
    render(
      <PermissionProvider
        access={{ permissions: [], flags: ["features.beta"] }}
      >
        <Can permission={{ flag: "features.beta" }}>
          <span>Beta feature</span>
        </Can>
      </PermissionProvider>,
    );
    expect(screen.getByText("Beta feature")).not.toBeNull();
  });
});

describe("Cannot", () => {
  it("renders children when denied", () => {
    renderWithAccess(
      <Cannot permission="users.delete">
        <span>Upgrade required</span>
      </Cannot>,
      ["users.create"],
    );
    expect(screen.getByText("Upgrade required")).not.toBeNull();
  });

  it("renders nothing when allowed", () => {
    renderWithAccess(
      <Cannot permission="users.create">
        <span>Upgrade required</span>
      </Cannot>,
      ["users.create"],
    );
    expect(screen.queryByText("Upgrade required")).toBeNull();
  });

  it("renders fallback when allowed", () => {
    renderWithAccess(
      <Cannot permission="users.create" fallback={<span>Has access</span>}>
        <span>No access</span>
      </Cannot>,
      ["users.create"],
    );
    expect(screen.getByText("Has access")).not.toBeNull();
    expect(screen.queryByText("No access")).toBeNull();
  });
});

describe("ProtectedRoute", () => {
  it("renders children when allowed", () => {
    renderWithAccess(
      <ProtectedRoute permission="pages.dashboard">
        <div>Dashboard</div>
      </ProtectedRoute>,
      ["pages.dashboard"],
    );
    expect(screen.getByText("Dashboard")).not.toBeNull();
  });

  it("renders fallback when denied", () => {
    renderWithAccess(
      <ProtectedRoute
        permission="pages.dashboard"
        fallback={<div>Forbidden</div>}
      >
        <div>Dashboard</div>
      </ProtectedRoute>,
      [],
    );
    expect(screen.getByText("Forbidden")).not.toBeNull();
    expect(screen.queryByText("Dashboard")).toBeNull();
  });

  it("has no router dependency", () => {
    // Just verify it renders without any router
    renderWithAccess(
      <ProtectedRoute permission="pages.admin">
        <div>Admin</div>
      </ProtectedRoute>,
      ["pages.admin"],
    );
    expect(screen.getByText("Admin")).not.toBeNull();
  });
});
