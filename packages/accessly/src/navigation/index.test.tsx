import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { filterNavigation, useFilteredNavigation } from "./index";
import type { AccessModel, NavigationItem } from "../types/access";

const items: NavigationItem[] = [
  { label: "Dashboard", href: "/", permission: "pages.dashboard" },
  {
    label: "Users",
    href: "/users",
    permission: "pages.users",
    children: [
      { label: "Create", href: "/users/create", permission: "users.create" },
      { label: "List", href: "/users/list", permission: "users.list" },
    ],
  },
  { label: "Settings", href: "/settings", permission: "pages.settings" },
];

describe("filterNavigation", () => {
  it("returns only permitted items", () => {
    const model: AccessModel = {
      permissions: ["pages.dashboard", "users.create"],
    };
    const result = filterNavigation(items, model);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Dashboard");
  });

  it("returns permitted items with nested children", () => {
    const model: AccessModel = {
      permissions: ["pages.users", "users.create"],
    };
    const result = filterNavigation(items, model);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Users");
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children![0].label).toBe("Create");
  });

  it("returns empty for null model", () => {
    const result = filterNavigation(items, null);
    expect(result).toEqual([]);
  });

  it("returns items without permission checks", () => {
    const noPermItems: NavigationItem[] = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ];
    const model: AccessModel = { permissions: [] };
    const result = filterNavigation(noPermItems, model);
    expect(result).toHaveLength(2);
  });
});

describe("useFilteredNavigation", () => {
  it("filters navigation items based on permissions", () => {
    function Nav() {
      const navItems: NavigationItem[] = [
        { label: "Dashboard", href: "/", permission: "pages.dashboard" },
        { label: "Users", href: "/users", permission: "pages.users" },
      ];
      const filtered = useFilteredNavigation(
        navItems,
        { permissions: ["pages.dashboard"] },
      );
      return (
        <ul>
          {filtered.map((item) => (
            <li key={item.label} data-testid="nav-item">
              {item.label}
            </li>
          ))}
        </ul>
      );
    }
    render(<Nav />);
    const items = screen.getAllByTestId("nav-item");
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe("Dashboard");
  });
});
