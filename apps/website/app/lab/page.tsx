"use client";

import { FeaturePill } from "@/components/ui/feature-pill";
import { Badge } from "@/components/ui/badge";
import { Card, CardGrid } from "@/components/ui/card";

export default function LabPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <FeaturePill label="Try before you install" />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mt-6 mb-4">
          Accessly Lab
        </h1>
        <p className="text-base text-muted max-w-xl mx-auto leading-relaxed">
          Test Accessly against your actual backend response, permission names, and UI patterns.
          No install required.
        </p>
      </div>

      {/* Coming soon feature cards */}
      <CardGrid cols={3}>
        <Card header="Step 1: Install">
          <p className="text-sm text-muted m-0">
            Choose npm, pnpm, yarn, or bun. Copy the command. Install later — but see it first.
          </p>
        </Card>
        <Card header="Step 2: Backend">
          <p className="text-sm text-muted m-0">
            Select Laravel, NestJS, Express, Django, or ASP.NET. Editable JSON loads automatically.
          </p>
        </Card>
        <Card header="Step 3: Adapter">
          <p className="text-sm text-muted m-0">
            Watch your backend response normalize into the standard AccessModel via auto-generated adapter code.
          </p>
        </Card>
        <Card header="Step 4: Test">
          <p className="text-sm text-muted m-0">
            Type any permission name and see the full decision object — matched, missing, checkedFrom, reason.
          </p>
        </Card>
        <Card header="Step 5: Preview">
          <p className="text-sm text-muted m-0">
            Live mini-dashboard shows sidebar filtering, action buttons, and field-level visibility in real time.
          </p>
        </Card>
        <Card header="Step 6: Ship">
          <p className="text-sm text-muted m-0">
            Copy the generated code, open in StackBlitz, or download a starter. All from one session.
          </p>
        </Card>
      </CardGrid>

      <div className="mt-12 text-center">
        <Badge variant="info">Coming Soon</Badge>
        <p className="mt-4 text-sm text-muted leading-relaxed">
          The full interactive lab experience is being built.
          <br />
          In the meantime, check out the{" "}
          <a href="/showcases" className="text-accent no-underline hover:underline">
            interactive showcases
          </a>{" "}
          or{" "}
          <a href="/docs" className="text-accent no-underline hover:underline">
            documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
}
