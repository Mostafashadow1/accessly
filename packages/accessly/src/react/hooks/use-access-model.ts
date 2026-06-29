import type { AccessModel } from "../../types";
import { useAccessContext } from "../provider";
import { getAccessContextModel } from "./access-context-model";

export function useAccessModel(): AccessModel | null {
  const ctx = useAccessContext();
  return getAccessContextModel(ctx);
}
