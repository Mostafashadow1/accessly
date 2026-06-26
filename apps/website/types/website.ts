/* ── Website Types ── */

export interface StatItem {
  val: string;
  label: string;
}

export interface InstallCommand {
  id: string;
  command: string;
  label: string;
}

export interface FeatureCard {
  icon: string;
  label: string;
  desc: string;
}

export interface ExplainItem {
  icon: string;
  text: string;
  color: string;
}

export interface PipelineStep {
  num: string;
  title: string;
  desc: string;
  code: string;
  color: string;
}

export interface DiagItem {
  allowed: boolean;
  label: string;
  perm: string;
  desc: string;
}

