'use client'

import { create } from 'zustand'

interface UIState {
  cartOpen: boolean
  pawfileOpen: boolean
  openCart: () => void
  closeCart: () => void
  openPawfile: () => void
  closePawfile: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  cartOpen: false,
  pawfileOpen: false,
  openCart: () => set({ cartOpen: true, pawfileOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openPawfile: () => set({ pawfileOpen: true, cartOpen: false }),
  closePawfile: () => set({ pawfileOpen: false }),
}))
