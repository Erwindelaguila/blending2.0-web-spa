// src/utils/persist-state.ts
export function loadState<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined; // 🛡 prevenir SSR

  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return undefined;
    return JSON.parse(serialized) as T;
  } catch (err) {
    console.error("Error loading state from localStorage[" + key + "]", err);
    return undefined;
  }
}

export function saveState<T>(key: string, state: T): void {
  if (typeof window === "undefined") return;

  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.error("Error saving state to localStorage[" + key + "]", err);
  }
}
