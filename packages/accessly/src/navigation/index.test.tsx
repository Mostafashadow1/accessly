import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { filterNavigation } from "./index";
import { useFilteredNavigation } from "../react/hooks";
import type { AccessModel, NavigationItem } from "../types";

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

  it("removes parent with no children after filtering even without permission", () => {
    const itemsWithNoPermParent: NavigationItem[] = [
      {
        label: "Parent",
        href: "/parent",
        // No permission on the parent itself – it's purely structural
        children: [
          { label: "Child", href: "/parent/child", permission: "child.perm" },
        ],
      },
    ];
    const model: AccessModel = { permissions: [] };
    const result = filterNavigation(itemsWithNoPermParent, model);
    // All children filtered out, parent should also be removed
    expect(result).toHaveLength(0);
  });

  it("keeps parent when children survive filtering (no parent permission)", () => {
    const itemsWithNoPermParent: NavigationItem[] = [
      {
        label: "Parent",
        href: "/parent",
        children: [
          { label: "Child", href: "/parent/child", permission: "child.perm" },
        ],
      },
    ];
    const model: AccessModel = { permissions: ["child.perm"] };
    const result = filterNavigation(itemsWithNoPermParent, model);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Parent");
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children![0].label).toBe("Child");
  });

  it("removes parent with no children when permission check passes but children filtered", () => {
    // If parent has permission but all children are filtered
    const itemsWithPermParent: NavigationItem[] = [
      {
        label: "Admin",
        href: "/admin",
        permission: "pages.admin",
        children: [
          { label: "Users", href: "/admin/users", permission: "admin.users" },
        ],
      },
    ];
    // User has pages.admin but not admin.users
    const model: AccessModel = { permissions: ["pages.admin"] };
    const result = filterNavigation(itemsWithPermParent, model);
    // Parent has no visible children, so it should be removed
    expect(result).toHaveLength(0);
  });

  it("keeps parent with permission when children survive", () => {
    const itemsWithPermParent: NavigationItem[] = [
      {
        label: "Admin",
        href: "/admin",
        permission: "pages.admin",
        children: [
          { label: "Users", href: "/admin/users", permission: "admin.users" },
        ],
      },
    ];
    const model: AccessModel = { permissions: ["pages.admin", "admin.users"] };
    const result = filterNavigation(itemsWithPermParent, model);
    expect(result).toHaveLength(1);
    expect(result[0].children).toHaveLength(1);
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
