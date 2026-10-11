'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Protein, Species } from '@/data/menu'
import type { ISODate } from '@/lib/dates'
import { priceLine, type LineConfig } from '@/lib/pricing'
import { safeJSONStorage } from '@/lib/storage'

export interface CartLine {
  id: string
  /** What was chosen. The price is always recomputed from menu.ts. */
  config: LineConfig
  quantity: number
}

export interface PetDetails {
  name: string
  species: Species
  allergies: Protein[]
  allergyNotes: string
}

export interface GiftDetails {
  recipientName: string
  pet: PetDetails
  note: string
  senderName: string
}

export type Fulfilment = 'delivery' | 'pickup'

export interface OrderDetails {
  date: ISODate | null
  fulfilment: Fulfilment
  /** Delivery locality only. The full address is shared on WhatsApp. */
  locality: string
  pet: PetDetails | null
  gift: GiftDetails | null
  notes: string
}

interface CartState extends OrderDetails {
  lines: CartLine[]
  add: (config: LineConfig, quantity?: number) => string
  setQuantity: (id: string, quantity: number) => void
  remove: (id: string) => void
  clear: () => void
  setDetails: (details: Partial<OrderDetails>) => void
}

export const MAX_QUANTITY = 20

const emptyDetails: OrderDetails = {
  date: null,
  fulfilment: 'delivery',
  locality: '',
  pet: null,
  gift: null,
  notes: '',
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Drop lines that no longer price (e.g. an item was removed from the menu). */
function isPriceable(line: CartLine) {
  try {
    priceLine(line.config)
    return true
  } catch {
    return false
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      ...emptyDetails,
      add: (config, quantity = 1) => {
        priceLine(config) // throws on an invalid configuration
        const id = newId()
        set((s) => ({ lines: [...s.lines, { id, config, quantity: clampQty(quantity) }] }))
        return id
      },
      setQuantity: (id, quantity) =>
        set((s) => ({ lines: s.lines.map((l) => (l.id === id ? { ...l, quantity: clampQty(quantity) } : l)) })),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      clear: () => set({ lines: [], ...emptyDetails }),
      setDetails: (details) => set(details),
    }),
    {
      name: 'pp-cart',
      version: 1,
      storage: safeJSONStorage,
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CartState>
        return { ...current, ...p, lines: (p.lines ?? []).filter(isPriceable) }
      },
    },
  ),
)

function clampQty(q: number) {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.round(q) || 1))
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + priceLine(l.config).total * l.quantity, 0)
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.quantity, 0)
}
