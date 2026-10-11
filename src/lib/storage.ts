import { createJSONStorage, type StateStorage } from 'zustand/middleware'

/**
 * localStorage that never throws (private mode, blocked storage, SSR, quota).
 * When storage is unavailable the site still works; it just forgets on reload.
 */
const guarded: StateStorage = {
  getItem(name) {
    try {
      return globalThis.localStorage?.getItem(name) ?? null
    } catch {
      return null
    }
  },
  setItem(name, value) {
    try {
      globalThis.localStorage?.setItem(name, value)
    } catch {
      /* storage unavailable: keep state in memory only */
    }
  },
  removeItem(name) {
    try {
      globalThis.localStorage?.removeItem(name)
    } catch {
      /* ignore */
    }
  },
}

export const safeJSONStorage = createJSONStorage(() => guarded)
