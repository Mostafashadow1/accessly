"use client";

import { useState, useMemo, type ReactNode } from "react";
import {
  PermissionProvider,
  Can,
  Cannot,
  usePermission,
  useAccessDecision,
} from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { hrSystemExample as config } from "@/data/examples";
import { ExampleShell } from "./example-shell";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ── Roles ────────────────────────────────────────────────────────── */

const ROLES = [
  { id: "hrAdmin", label: "HR Admin", color: "text-danger bg-danger/10 border-danger/20" },
  { id: "hrManager", label: "HR Manager", color: "text-warning bg-warning/10 border-warning/20" },
  { id: "payrollOfficer", label: "Payroll Officer", color: "text-accent bg-primary/10 border-primary/20" },
  { id: "employee", label: "Employee", color: "text-muted bg-surface border-border" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

const ROLE_PERMISSIONS: Record<RoleId, string[]> = {
  hrAdmin: [
    "employees.view",
    "employees.create",
    "employees.update",
    "employees.delete",
    "payroll.view",
    "payroll.update",
    "attendance.view",
    "reports.export",
    "documents.view",
    "documents.upload",
  ],
  hrManager: [
    "employees.view",
    "employees.create",
    "employees.update",
    "payroll.view",
    "attendance.view",
    "reports.export",
    "documents.view",
    "documents.upload",
  ],
  payrollOfficer: [
    "employees.view",
    "payroll.view",
    "payroll.update",
    "attendance.view",
    "reports.export",
  ],
  employee: [
    "employees.view",
    "attendance.view",
    "documents.view",
  ],
};

/* ── Mock data ────────────────────────────────────────────────────── */

const MOCK_EMPLOYEES = [
  { id: 1, name: "Jane Doe", email: "jane@acme.com", department: "Engineering", salary: 95000, role: "employee" },
  { id: 2, name: "John Smith", email: "john@acme.com", department: "Marketing", salary: 82000, role: "employee" },
  { id: 3, name: "Sarah Lee", email: "sarah@acme.com", department: "Engineering", salary: 110000, role: "manager" },
  { id: 4, name: "Mike Brown", email: "mike@acme.com", department: "Finance", salary: 78000, role: "employee" },
];

const MOCK_DOCUMENTS = [
  { id: 1, name: "Employee Handbook 2026", type: "PDF", updated: "2 days ago" },
  { id: 2, name: "Benefits Overview Q3", type: "PDF", updated: "1 week ago" },
  { id: 3, name: "Payroll Tax Forms", type: "XLSX", updated: "3 days ago" },
];

/* ════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                     */
/* ════════════════════════════════════════════════════════════════════ */

export function HrSystemExample() {
  const [selectedRole, setSelectedRole] = useState<RoleId>("hrManager");
  const [activeTab, setActiveTab] = useState<"employees" | "payroll" | "documents">("employees");

  const rolePerms = ROLE_PERMISSIONS[selectedRole];

  const accessModel = useMemo(
    () => ({
      user: { id: "usr_hr_demo", roles: [selectedRole] },
      permissions: rolePerms,
      isLoading: false,
    }),
    [selectedRole],
  );

  return (
    <ExampleShell
      title={config.title}
      description={config.description}
      icon={config.icon}
      apisTested={config.apisTested}
      explanation={config.codeExplanation}
      codeSnippet={
        <CodeBlock code={config.codeSnippet} language="tsx" title="hr-system.tsx" />
      }
    >
      <PermissionProvider access={accessModel}>
        <div className="space-y-5">
          {/* Role Selector */}
          <RoleSelector roles={ROLES} selected={selectedRole} onSelect={setSelectedRole} />

          {/* Permission Summary */}
          <PermissionSummary permissions={rolePerms} />

          {/* Mini HR UI */}
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated border-b border-border">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-foreground">🏢 Acme Corp HR</span>
                <RoleBadge role={selectedRole} />
              </div>
              <div className="text-[9px] font-mono text-muted">
                {rolePerms.length} permissions active
              </div>
            </div>

            {/* Tab navigation — role-filtered */}
            <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-[#09090c]">
              <TabButton
                active={activeTab === "employees"}
                onClick={() => setActiveTab("employees")}
                label="Employees"
                always
              />
              <Can permission="payroll.view" fallback={null}>
                <TabButton
                  active={activeTab === "payroll"}
                  onClick={() => setActiveTab("payroll")}
                  label="Payroll"
                  always
                />
              </Can>
              <Can permission="documents.view" fallback={null}>
                <TabButton
                  active={activeTab === "documents"}
                  onClick={() => setActiveTab("documents")}
                  label="Documents"
                  always
                />
              </Can>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === "employees" && <EmployeesSection role={selectedRole} />}
              {activeTab === "payroll" && <PayrollSection role={selectedRole} />}
              {activeTab === "documents" && <DocumentsSection role={selectedRole} />}
            </div>
          </div>

          {/* Decision Output */}
          <DecisionOutputs permissions={rolePerms} />
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
  roles: readonly { id: string; label: string; color: string }[];
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
              ? role.color + " shadow-sm"
              : "bg-surface border-border text-muted hover:text-foreground hover:border-border-hover",
          )}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    hrAdmin: "bg-danger/10 text-danger border-danger/20",
    hrManager: "bg-warning/10 text-warning border-warning/20",
    payrollOfficer: "bg-primary/10 text-accent border-primary/20",
    employee: "bg-surface text-muted-dark border-border",
  };
  return (
    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono uppercase tracking-wider", colors[role] || "")}>
      {role}
    </span>
  );
}

function TabButton({ active, onClick, label, always }: { active: boolean; onClick: () => void; label: string; always?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded text-[10px] font-medium border transition-all duration-100 cursor-pointer",
        active
          ? "bg-primary/10 text-accent border-primary/20"
          : "bg-transparent border-transparent text-muted hover:text-foreground hover:bg-surface-hover",
      )}
    >
      {label}
    </button>
  );
}

function PermissionSummary({ permissions }: { permissions: string[] }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface/30 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono">🔑 Permissions</span>
        <span className="text-[9px] font-mono text-muted-dark">{permissions.length} / {config.allPermissions.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {config.allPermissions.map((perm) => {
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

/* ── Employees Tab ────────────────────────────────────────────────── */

function EmployeesSection({ role }: { role: RoleId }) {
  const canCreate = usePermission("employees.create");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">👥 Employees</span>
        <Can
          permission="employees.create"
          fallback={<span className="text-[9px] text-muted-dark italic">🔒 Cannot add employees</span>}
        >
          <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none shadow-sm shadow-primary/20">
            + Add Employee
          </button>
        </Can>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[9px] font-bold text-muted uppercase tracking-wider font-mono border-b border-border bg-surface-hover">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Department</th>
              <th className="px-3 py-2">Salary</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-xs">
            {MOCK_EMPLOYEES.map((emp) => (
              <tr key={emp.id} className="hover:bg-surface-hover transition-colors duration-100">
                <td className="px-3 py-2 text-foreground font-medium">{emp.name}</td>
                <td className="px-3 py-2 text-muted">{emp.email}</td>
                <td className="px-3 py-2 text-muted">{emp.department}</td>
                <td className="px-3 py-2">
                  {/* Field-level: salary hidden unless payroll.view */}
                  <Can
                    permission="payroll.view"
                    fallback={<span className="text-muted-dark font-mono text-[10px]">•••••</span>}
                  >
                    <span className="font-mono text-foreground">${emp.salary.toLocaleString()}</span>
                  </Can>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Can
                      permission="employees.update"
                      fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
                    >
                      <button className="px-2 py-0.5 rounded text-[9px] font-semibold bg-primary/10 border border-primary/20 text-accent cursor-pointer hover:bg-primary/20 transition-all duration-150">
                        Edit
                      </button>
                    </Can>
                    <Cannot
                      permission="employees.delete"
                      fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
                    >
                      <button className="px-2 py-0.5 rounded text-[9px] font-semibold bg-danger/10 border border-danger/20 text-danger cursor-pointer hover:bg-danger/20 transition-all duration-150">
                        Remove
                      </button>
                    </Cannot>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* useAccessDecision for employee update */}
      <div className="flex items-center gap-2 text-[9px] font-mono">
        <span className="text-muted">useAccessDecision("employees.update"):</span>
        <PermissionState permission="employees.update" />
        <span className="text-muted-dark ml-2">· useAccessDecision("employees.delete"):</span>
        <PermissionState permission="employees.delete" />
      </div>
    </div>
  );
}

function PermissionState({ permission }: { permission: string }) {
  const decision = useAccessDecision(permission);
  return (
    <span className={cn(
      "font-bold",
      decision.allowed ? "text-success" : "text-danger",
    )}>
      {decision.allowed ? "ALLOWED" : "DENIED"}
      <span className="text-muted-dark font-normal ml-1">({decision.reason})</span>
    </span>
  );
}

/* ── Payroll Tab ──────────────────────────────────────────────────── */

function PayrollSection({ role }: { role: RoleId }) {
  const canUpdatePayroll = usePermission("payroll.update");
  const exportDecision = useAccessDecision("reports.export");

  return (
    <div className="space-y-4">
      <ProtectedPayrollArea role={role}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">💰 Payroll Summary</span>
          <Can
            permission="payroll.update"
            fallback={<span className="text-[9px] text-muted-dark italic">View only</span>}
          >
            <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-primary text-white cursor-pointer border-none shadow-sm shadow-primary/20">
              Process Payroll
            </button>
          </Can>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border/50 bg-surface/30 p-3">
            <div className="text-[9px] text-muted font-mono">Total Payroll</div>
            <div className="text-sm font-bold text-foreground">$365,000</div>
            <div className="text-[9px] text-success mt-1">+2.4% vs last month</div>
          </div>
          <div className="rounded-lg border border-border/50 bg-surface/30 p-3">
            <div className="text-[9px] text-muted font-mono">Active Employees</div>
            <div className="text-sm font-bold text-foreground">42</div>
            <div className="text-[9px] text-muted mt-1">Full-time equivalent</div>
          </div>
          <div className="rounded-lg border border-border/50 bg-surface/30 p-3">
            <div className="text-[9px] text-muted font-mono">Avg Salary</div>
            <div className="text-sm font-bold text-foreground">$8,690</div>
            <div className="text-[9px] text-muted mt-1">Monthly average</div>
          </div>
        </div>

        {/* Export Reports */}
        <div className="rounded-lg border border-border/50 bg-surface/20 p-3 flex items-center justify-between">
          <span className="text-[10px] text-muted font-mono">Export payroll reports for accounting</span>
          <Can
            permission="reports.export"
            fallback={<span className="text-[9px] text-muted-dark italic">🔒 Export restricted</span>}
          >
            <button
              className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all duration-150 cursor-pointer",
                exportDecision.allowed
                  ? "bg-primary text-white border-transparent shadow-sm shadow-primary/20"
                  : "bg-surface border-border text-muted-dark cursor-not-allowed",
              )}
              disabled={!exportDecision.allowed}
            >
              Export Reports
            </button>
          </Can>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="text-muted">useAccessDecision("reports.export"):</span>
          <PermissionState permission="reports.export" />
        </div>

        {/* Attendance Summary — visible to all with attendance.view */}
        <div className="rounded-lg border border-border bg-surface/20 p-4 mt-4">
          <span className="text-xs font-bold text-foreground mb-3 block">📋 Attendance Summary</span>
          <div className="grid grid-cols-3 gap-3">
            <AttendanceCard label="Present Today" value="38" color="text-success" />
            <AttendanceCard label="On Leave" value="3" color="text-warning" />
            <AttendanceCard label="Absent" value="1" color="text-danger" />
          </div>
        </div>
      </ProtectedPayrollArea>
    </div>
  );
}

function ProtectedPayrollArea({ role, children }: { role: RoleId; children: React.ReactNode }) {
  return (
    <Can
      permission="payroll.view"
      fallback={
        <div className="rounded-lg border border-warning/20 bg-warning/5 p-8 text-center">
          <span className="text-sm text-warning font-medium">🔒 Payroll Access Restricted</span>
          <p className="text-xs text-muted mt-2">You need payroll.view permission to access this section.</p>
        </div>
      }
    >
      <div className="space-y-4">{children}</div>
    </Can>
  );
}

function AttendanceCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface/30 p-3 text-center">
      <div className="text-[9px] text-muted font-mono">{label}</div>
      <div className={cn("text-lg font-bold", color)}>{value}</div>
    </div>
  );
}

/* ── Documents Tab ────────────────────────────────────────────────── */

function DocumentsSection({ role }: { role: RoleId }) {
  const uploadDecision = useAccessDecision("documents.upload");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">📄 Documents</span>
        <Can
          permission="documents.upload"
          fallback={<span className="text-[9px] text-muted-dark italic">🔒 Upload restricted</span>}
        >
          <button
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all duration-150 cursor-pointer",
              uploadDecision.allowed
                ? "bg-primary text-white border-transparent shadow-sm shadow-primary/20"
                : "bg-surface border-border text-muted-dark cursor-not-allowed",
            )}
            disabled={!uploadDecision.allowed}
          >
            + Upload Document
          </button>
        </Can>
      </div>

      <div className="divide-y divide-border/30 rounded-lg border border-border">
        {MOCK_DOCUMENTS.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between px-4 py-3 text-xs hover:bg-surface-hover transition-colors duration-100">
            <div className="flex items-center gap-3">
              <span className="text-base">{doc.type === "PDF" ? "📕" : "📗"}</span>
              <div>
                <div className="text-foreground font-medium">{doc.name}</div>
                <div className="text-[9px] text-muted font-mono">{doc.type} · {doc.updated}</div>
              </div>
            </div>
            <Can
              permission="documents.upload"
              fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
            >
              <button className="px-2 py-0.5 rounded text-[9px] font-semibold bg-surface border border-border text-muted hover:text-foreground cursor-pointer transition-all duration-150">
                Download
              </button>
            </Can>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-[9px] font-mono">
        <span className="text-muted">useAccessDecision("documents.upload"):</span>
        <PermissionState permission="documents.upload" />
      </div>
    </div>
  );
}

function DecisionOutputs({ permissions }: { permissions: string[] }) {
  return (
    <div className="rounded-xl border border-border/50 bg-surface/30 p-4">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
        <span>🎯</span> Decision Outputs (useAccessDecision)
      </span>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {config.allPermissions.map((perm) => {
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
    </div>
  );
}
