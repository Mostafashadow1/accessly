"use client";

import { useState, useMemo } from "react";
import {
  PermissionProvider,
  Can,
  Cannot,
  usePermission,
  useAccessDecision,
} from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { cmsExample as config } from "@/data/examples";
import { ExampleShell } from "./example-shell";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ── Roles ────────────────────────────────────────────────────────── */

const ROLES = [
  { id: "author", label: "Author", description: "Create and edit own posts" },
  { id: "editor", label: "Editor", description: "Publish and manage all" },
  { id: "admin", label: "Admin", description: "Full control including delete" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

const ROLE_PERMISSIONS: Record<RoleId, string[]> = {
  author: ["posts.view", "posts.create", "posts.edit", "media.upload"],
  editor: ["posts.view", "posts.create", "posts.edit", "posts.publish", "media.upload"],
  admin: ["posts.view", "posts.create", "posts.edit", "posts.publish", "posts.delete", "media.upload"],
};

/* ── Mock posts ───────────────────────────────────────────────────── */

interface Post {
  id: number;
  title: string;
  status: "draft" | "published" | "review";
  author: string;
  date: string;
}

const MOCK_POSTS: Post[] = [
  { id: 1, title: "Getting Started with Accessly", status: "published", author: "Alice", date: "2026-06-25" },
  { id: 2, title: "Advanced Permission Patterns", status: "draft", author: "Bob", date: "2026-06-27" },
  { id: 3, title: "Migrating from RBAC to ReBAC", status: "review", author: "Alice", date: "2026-06-26" },
  { id: 4, title: "Feature Flags in Production", status: "draft", author: "Bob", date: "2026-06-28" },
];

/* ════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                     */
/* ════════════════════════════════════════════════════════════════════ */

export function CmsExample() {
  const [selectedRole, setSelectedRole] = useState<RoleId>("editor");
  const [posts, setPosts] = useState(MOCK_POSTS);

  const rolePerms = ROLE_PERMISSIONS[selectedRole];

  const accessModel = useMemo(
    () => ({
      user: { id: "usr_cms_demo", roles: [selectedRole] },
      permissions: rolePerms,
      isLoading: false,
    }),
    [selectedRole],
  );

  const handleDelete = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handlePublish = (postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, status: "published" as const } : p,
      ),
    );
  };

  return (
    <ExampleShell
      title={config.title}
      description={config.description}
      icon={config.icon}
      apisTested={config.apisTested}
      explanation={config.codeExplanation}
      codeSnippet={
        <CodeBlock code={config.codeSnippet} language="tsx" title="cms.tsx" />
      }
    >
      <PermissionProvider access={accessModel}>
        <div className="space-y-5">
          {/* Role Selector */}
          <RoleSelector
            roles={ROLES}
            selected={selectedRole}
            onSelect={setSelectedRole}
          />

          {/* Permission Summary */}
          <PermissionSummary
            role={selectedRole}
            permissions={rolePerms}
          />

          {/* Mini CMS UI */}
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated border-b border-border">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-foreground">Content Manager</span>
                <span className="text-[10px] font-mono text-muted bg-surface px-2 py-0.5 rounded border border-border">
                  {selectedRole.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Create Post — gated */}
                <Can
                  permission="posts.create"
                  fallback={
                    <span className="text-[9px] text-muted-dark italic">🔒 No create access</span>
                  }
                >
                  <CreatePostButton />
                </Can>
              </div>
            </div>

            {/* Post list */}
            <div className="divide-y divide-border/30">
              {posts.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  role={selectedRole}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                />
              ))}
            </div>

            {/* Empty state */}
            {posts.length === 0 && (
              <div className="p-8 text-center text-sm text-muted italic">
                All posts have been removed. Create a new post to get started.
              </div>
            )}
          </div>

          {/* Decision Output */}
          <DecisionOutputs role={selectedRole} permissions={rolePerms} />
        </div>
      </PermissionProvider>
    </ExampleShell>
  );
}

/* ════════════════════════════════════════════════════════════════════ */
/*  SUB-COMPONENTS                                                     */
/* ════════════════════════════════════════════════════════════════════ */

function RoleSelector({
  roles,
  selected,
  onSelect,
}: {
  roles: readonly { id: string; label: string; description: string }[];
  selected: string;
  onSelect: (id: any) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono mr-1">
        Role:
      </span>
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelect(role.id)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer",
            selected === role.id
              ? "bg-primary/10 text-accent border-primary/30 shadow-sm"
              : "bg-surface border-border text-muted hover:text-foreground hover:border-border-hover",
          )}
          title={role.description}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}

function PermissionSummary({ role, permissions }: { role: string; permissions: string[] }) {
  const allPerms = config.allPermissions;
  return (
    <div className="rounded-lg border border-border/50 bg-surface/30 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono">
          🔑 Active Permissions
        </span>
        <span className="text-[9px] font-mono text-muted-dark">
          {permissions.length} / {allPerms.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {allPerms.map((perm) => {
          const has = permissions.includes(perm);
          return (
            <span
              key={perm}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono border transition-all duration-150",
                has
                  ? "bg-success-bg text-success border-success/20"
                  : "bg-surface-2 text-muted-dark border-border/40",
              )}
            >
              {has ? "✓" : "○"} {perm}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function CreatePostButton() {
  return (
    <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none shadow-sm shadow-primary/20 hover:shadow-md transition-all duration-150 flex items-center gap-1">
      <span>+</span> New Post
    </button>
  );
}

function PostRow({
  post,
  role,
  onDelete,
  onPublish,
}: {
  post: Post;
  role: RoleId;
  onDelete: (id: number) => void;
  onPublish: (id: number) => void;
}) {
  const canPublish = usePermission("posts.publish");
  const canEdit = usePermission("posts.edit");
  const canDelete = usePermission("posts.delete");

  const statusColors: Record<string, string> = {
    draft: "bg-surface-2 text-muted-dark border-border/40",
    published: "bg-success-bg text-success border-success/20",
    review: "bg-warning-bg text-warning border-warning/20",
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 text-xs hover:bg-surface-hover transition-colors duration-100">
      {/* Post info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium truncate">{post.title}</span>
          {/* Field-level: only show edit indicator if canEdit */}
          {canEdit && (
            <span className="text-[8px] text-accent bg-primary/5 px-1 rounded border border-primary/10">
              editable
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-[9px] text-muted font-mono">
          <span>{post.author}</span>
          <span>{post.date}</span>
          <span className={cn(
            "inline-flex px-1.5 py-0.5 rounded text-[8px] font-semibold border",
            statusColors[post.status],
          )}>
            {post.status}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0 ml-3">
        {/* Publish button — uses Can */}
        <Can
          permission="posts.publish"
          fallback={
            post.status === "draft" || post.status === "review" ? (
              <span className="text-[9px] text-muted-dark italic px-1">
                Submit for Review
              </span>
            ) : null
          }
        >
          {post.status !== "published" && (
            <button
              onClick={() => onPublish(post.id)}
              className="px-2 py-1 rounded-lg text-[9px] font-semibold bg-primary/10 border border-primary/20 text-accent cursor-pointer hover:bg-primary/20 transition-all duration-150"
            >
              Publish
            </button>
          )}
        </Can>

        {/* Cannot example: Delete fallback */}
        <Cannot
          permission="posts.delete"
          fallback={
            <span className="text-[9px] text-muted-dark italic flex items-center gap-0.5" title="Delete not available">
              🔒
            </span>
          }
        >
          <button
            onClick={() => onDelete(post.id)}
            className="px-2 py-1 rounded-lg text-[9px] font-semibold bg-danger/10 border border-danger/20 text-danger cursor-pointer hover:bg-danger/20 transition-all duration-150"
          >
            Delete
          </button>
        </Cannot>
      </div>
    </div>
  );
}

function DecisionOutputs({ role, permissions }: { role: string; permissions: string[] }) {
  const allPerms = config.allPermissions;
  return (
    <div className="rounded-xl border border-border/50 bg-surface/30 p-4">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
        <span>🎯</span> Decision Outputs
      </span>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {allPerms.map((perm) => {
          const has = permissions.includes(perm);
          return (
            <div
              key={perm}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-mono border",
                has
                  ? "bg-success-bg border-success/20 text-success"
                  : "bg-danger-subtle border-danger/20 text-danger",
              )}
            >
              <span>{has ? "✓" : "✗"}</span>
              <span className="truncate">{perm}</span>
              <span className="ml-auto text-[8px] opacity-70">
                {has ? "allowed" : "denied"}
              </span>
            </div>
          );
        })}
      </div>
      {/* usePermission states */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <span className="text-[9px] font-mono text-muted-dark block mb-2">
          usePermission() states:
        </span>
        <div className="flex flex-wrap gap-2 text-[10px] font-mono">
          {allPerms.map((perm) => (
            <PermissionState key={perm} permission={perm} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PermissionState({ permission }: { permission: string }) {
  const allowed = usePermission(permission);
  return (
    <span className={cn(
      "px-2 py-0.5 rounded border",
      allowed
        ? "bg-success-bg text-success border-success/20"
        : "bg-surface-2 text-muted-dark border-border/40",
    )}>
      {permission}: {allowed ? "✓" : "✗"}
    </span>
  );
}
