import { createJSONStorage, type StateStorage } from "zustand/middleware";

/**
 * Persistence boundary.
 *
 * Every persisted store goes through `milomiStorage`, which delegates to a
 * swappable key/value adapter. Today that is localStorage. Later a Supabase
 * adapter (async getItem/setItem against a `profiles` row) can be installed
 * with `setStorageAdapter()` without touching any UI component or store.
 */
export type StorageAdapter = StateStorage;

const memory = new Map<string, string>();

const localAdapter: StorageAdapter = {
  getItem: (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      memory.set(key, value);
    }
  },
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      memory.delete(key);
    }
  },
};

let adapter: StorageAdapter = localAdapter;

export function setStorageAdapter(next: StorageAdapter) {
  adapter = next;
}

export const STORAGE_PREFIX = "milomi:";

export const milomiStorage = createJSONStorage(() => ({
  getItem: (k: string) => adapter.getItem(k),
  setItem: (k: string, v: string) => adapter.setItem(k, v),
  removeItem: (k: string) => adapter.removeItem(k),
}));
