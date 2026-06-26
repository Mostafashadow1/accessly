import type { BackendResponseExample } from "@/types/backend";
import type { BackendData } from "@/types/playground";

/* ── Backend data for the backend-section (Your backend, any shape) ── */

export const backendAdapters: BackendResponseExample[] = [
  {
    id: "laravel",
    label: "Laravel",
    response: `{
  "id": 1,
  "name": "Alex Admin",
  "all_permissions": [
    "posts.create",
    "posts.delete",
    "users.view"
  ]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.all_permissions,
  user: {
    id: src.id,
    name: src.name
  }
}))`,
    model: `{
  "permissions": [
    "posts.create",
    "posts.delete",
    "users.view"
  ],
  "user": {
    "id": 1,
    "name": "Alex Admin"
  }
}`,
  },
  {
    id: "nestjs",
    label: "NestJS",
    response: `{
  "user": {
    "id": "usr_99",
    "roles": ["editor"],
    "abilities": [
      "read:articles",
      "write:articles"
    ]
  }
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.user.abilities,
  roles: src.user.roles,
  user: { id: src.user.id }
}))`,
    model: `{
  "permissions": [
    "read:articles",
    "write:articles"
  ],
  "roles": ["editor"],
  "user": { "id": "usr_99" }
}`,
  },
  {
    id: "aspnet",
    label: "ASP.NET",
    response: `{
  "nameid": "1002",
  "role": ["Administrator"],
  "claims": [
    {
      "type": "permission",
      "value": "billing.read"
    },
    {
      "type": "permission",
      "value": "billing.write"
    }
  ]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.claims
    .filter(c => c.type === "permission")
    .map(c => c.value),
  roles: src.role,
  user: { id: src.nameid }
}))`,
    model: `{
  "permissions": [
    "billing.read",
    "billing.write"
  ],
  "roles": ["Administrator"],
  "user": { "id": "1002" }
}`,
  },
  {
    id: "express",
    label: "Express",
    response: `{
  "sessionID": "sess_881",
  "user": { "id": 42 },
  "scopes": [
    "admin:dashboard",
    "user:edit"
  ]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.scopes,
  user: { id: src.user.id }
}))`,
    model: `{
  "permissions": [
    "admin:dashboard",
    "user:edit"
  ],
  "user": { "id": 42 }
}`,
  },
  {
    id: "custom",
    label: "Custom",
    response: `{
  "meta": { "version": "v2" },
  "body": {
    "profile": { "uuid": "u-873" },
    "grants": [
      "view_dashboard",
      "edit_profile"
    ]
  }
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.body.grants.map(
    g => g.replace(/_/, ".")
  ),
  user: {
    id: src.body.profile.uuid
  }
}))`,
    model: `{
  "permissions": [
    "view.dashboard",
    "edit.profile"
  ],
  "user": { "id": "u-873" }
}`,
  },
];

/* ── Backend data for the Playground interactive demo ── */

export const backends: BackendData[] = [
  {
    id: "laravel",
    label: "Laravel",
    hasPermission: true,
    response: `{
  "id": 1,
  "name": "Alex Admin",
  "all_permissions": [
    "posts.create",
    "posts.delete",
    "users.view"
  ]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.all_permissions,
  user: { id: src.id, name: src.name }
}))`,
    model: `{
  "permissions": [
    "posts.create",
    "posts.delete",
    "users.view"
  ],
  "user": { "id": 1, "name": "Alex Admin" }
}`,
  },
  {
    id: "nestjs",
    label: "NestJS",
    hasPermission: false,
    response: `{
  "user": {
    "id": "usr_99",
    "roles": ["editor"],
    "abilities": [
      "read:articles",
      "write:articles"
    ]
  }
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.user.abilities,
  roles: src.user.roles,
  user: { id: src.user.id }
}))`,
    model: `{
  "permissions": ["read:articles","write:articles"],
  "roles": ["editor"],
  "user": { "id": "usr_99" }
}`,
  },
  {
    id: "aspnet",
    label: "ASP.NET",
    hasPermission: false,
    response: `{
  "nameid": "1002",
  "role": ["Administrator"],
  "claims": [
    { "type": "permission", "value": "billing.read" },
    { "type": "permission", "value": "billing.write" }
  ]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.claims
    .filter(c => c.type === "permission")
    .map(c => c.value),
  roles: src.role,
  user: { id: src.nameid }
}))`,
    model: `{
  "permissions": ["billing.read","billing.write"],
  "roles": ["Administrator"],
  "user": { "id": "1002" }
}`,
  },
  {
    id: "express",
    label: "Express",
    hasPermission: false,
    response: `{
  "sessionID": "sess_881",
  "user": { "id": 42 },
  "scopes": ["admin:dashboard","user:edit"]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.scopes,
  user: { id: src.user.id }
}))`,
    model: `{
  "permissions": ["admin:dashboard","user:edit"],
  "user": { "id": 42 }
}`,
  },
  {
    id: "custom",
    label: "Custom",
    hasPermission: false,
    response: `{
  "meta": { "version": "v2" },
  "body": {
    "profile": { "uuid": "u-873" },
    "grants": ["view_dashboard","edit_profile"]
  }
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.body.grants
    .map(g => g.replace(/_/, ".")),
  user: { id: src.body.profile.uuid }
}))`,
    model: `{
  "permissions": ["view.dashboard","edit.profile"],
  "user": { "id": "u-873" }
}`,
  },
];

export const backendList = [
  "Laravel",
  "NestJS",
  "ASP.NET Core",
  "Express",
  "Django REST",
  "Any custom API",
];
