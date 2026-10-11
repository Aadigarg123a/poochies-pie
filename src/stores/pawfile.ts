'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Protein, Species } from '@/data/menu'
import type { ISODate } from '@/lib/dates'
import { safeJSONStorage } from '@/lib/storage'

export type BreedSize = 'small' | 'medium' | 'large'

export interface Pawfile {
  name: string
  species: Species
  breedSize: BreedSize | null
  /** YYYY-MM-DD. The year may be approximate. */
  birthday: ISODate | null
  allergies: Protein[]
  /** Anything else the bakery should know (free text, shared on WhatsApp). */
  allergyNotes: string
}

interface PawfileState {
  pawfile: Pawfile | null
  /** When on, /menu flags items that conflict with the Pawfile. */
  safeFilter: boolean
  save: (pawfile: Pawfile) => void
  clear: () => void
  setSafeFilter: (on: boolean) => void
}

export const usePawfileStore = create<PawfileState>()(
  persist(
    (set) => ({
      pawfile: null,
      safeFilter: false,
      save: (pawfile) => set({ pawfile: { ...pawfile, name: pawfile.name.trim(), allergyNotes: pawfile.allergyNotes.trim() } }),
      clear: () => set({ pawfile: null, safeFilter: false }),
      setSafeFilter: (safeFilter) => set({ safeFilter }),
    }),
    { name: 'pp-pawfile', version: 1, storage: safeJSONStorage, skipHydration: true },
  ),
)
