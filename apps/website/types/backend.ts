/* ── Backend Types ── */

export interface BackendResponseExample {
  id: string;
  label: string;
  response: string;
  adapter: string;
  model: string;
}

export type AdapterPreview = BackendResponseExample;
export type NormalizedAccessModelPreview = BackendResponseExample;
