"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { TerminalBlock } from "@/components/ui/terminal-block";
import { CodeBlock } from "@/components/ui/code-block";
import { PlaygroundPanel } from "@/components/ui/playground-panel";
import { Card, CardGrid } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeaturePill } from "@/components/ui/feature-pill";

export default function LabPage() {
  return (
    <div className="section">
      <div className="section-container">
        <div className="text-center mb-12">
          <FeaturePill label="Try before you install" />
          <h1 className="text-[32px] md:text-[40px] font-bold mt-6 mb-4">
            Accessly Lab
          </h1>
          <p
            className="text-[15px] md:text-[16px] max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Test Accessly against your actual backend response, permission names, and UI patterns.
            No install required.
          </p>
        </div>

        {/* Coming soon feature cards */}
        <CardGrid cols={3}>
          <Card header="Step 1: Install">
            <p className="text-[13px] m-0" style={{ color: "var(--text-secondary)" }}>
              Choose npm, pnpm, yarn, or bun. Copy the command. Install later — but see it first.
            </p>
          </Card>
          <Card header="Step 2: Backend">
            <p className="text-[13px] m-0" style={{ color: "var(--text-secondary)" }}>
              Select Laravel, NestJS, Express, Django, or ASP.NET. Editable JSON loads automatically.
            </p>
          </Card>
          <Card header="Step 3: Adapter">
            <p className="text-[13px] m-0" style={{ color: "var(--text-secondary)" }}>
              Watch your backend response normalize into the standard AccessModel via auto-generated adapter code.
            </p>
          </Card>
          <Card header="Step 4: Test">
            <p className="text-[13px] m-0" style={{ color: "var(--text-secondary)" }}>
              Type any permission name and see the full decision object — matched, missing, checkedFrom, reason.
            </p>
          </Card>
          <Card header="Step 5: Preview">
            <p className="text-[13px] m-0" style={{ color: "var(--text-secondary)" }}>
              Live mini-dashboard shows sidebar filtering, action buttons, and field-level visibility in real time.
            </p>
          </Card>
          <Card header="Step 6: Ship">
            <p className="text-[13px] m-0" style={{ color: "var(--text-secondary)" }}>
              Copy the generated code, open in StackBlitz, or download a starter. All from one session.
            </p>
          </Card>
        </CardGrid>

        <div className="mt-12 text-center">
          <Badge variant="info">Coming Soon</Badge>
          <p className="mt-4 text-[14px]" style={{ color: "var(--text-secondary)" }}>
            The full interactive lab experience is being built.
            <br />
            In the meantime, check out the{" "}
            <a href="/showcases" style={{ color: "var(--color-secondary)" }}>
              interactive showcases
            </a>{" "}
            or{" "}
            <a href="/docs" style={{ color: "var(--color-secondary)" }}>
              documentation
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
