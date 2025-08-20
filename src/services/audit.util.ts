import { store } from "@/lib/store";

export function getCurrentUserId(): string | null {
  try {
    const { auth } = store.getState();
    return auth.userInfo?.id ?? auth.user?.id ?? null;
  } catch {
    return null;
  }
}

const withAudit = <T extends Record<string, any>>(payload: T, field: "CreadoPorId" | "ModificadoPorId"): T => {
  const id = getCurrentUserId();
  return id ? ({ ...payload, [field]: id } as T) : payload;
};

export const withCreateAudit = <T extends Record<string, any>>(payload: T): T => withAudit(payload, "CreadoPorId");
export const withUpdateAudit = <T extends Record<string, any>>(payload: T): T => withAudit(payload, "ModificadoPorId");
