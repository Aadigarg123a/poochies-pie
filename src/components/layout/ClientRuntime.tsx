'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/stores/cart'
import { usePawfileStore } from '@/stores/pawfile'
import { useUIStore } from '@/stores/ui'

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer').then((m) => m.CartDrawer), { ssr: false })
const PawfileSheet = dynamic(() => import('@/components/pawfile/PawfileSheet').then((m) => m.PawfileSheet), { ssr: false })

/**
 * Client-only plumbing mounted once in the root layout:
 * - rehydrates persisted stores after hydration (no SSR mismatch)
 * - enhances [data-reveal] sections with a scroll reveal
 * - lazy-loads the cart drawer and Pawfile sheet on first open
 */
export function ClientRuntime() {
  const cartOpen = useUIStore((s) => s.cartOpen)
  const pawfileOpen = useUIStore((s) => s.pawfileOpen)
  const [drawerLoaded, setDrawerLoaded] = useState(false)
  const [pawfileLoaded, setPawfileLoaded] = useState(false)

  useEffect(() => {
    void useCartStore.persist.rehydrate()
    void usePawfileStore.persist.rehydrate()
  }, [])

  // Loading the drawer is a one-way latch: once opened, keep it mounted.
  if (cartOpen && !drawerLoaded) setDrawerLoaded(true)
  if (pawfileOpen && !pawfileLoaded) setPawfileLoaded(true)

  useEffect(() => startReveal(), [])

  return (
    <>
      {drawerLoaded ? <CartDrawer /> : null}
      {pawfileLoaded ? <PawfileSheet /> : null}
    </>
  )
}

function startReveal() {
  const root = document.documentElement
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          io.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )

  const watch = (el: Element) => {
    if (el.classList.contains('is-revealed')) return
    // Anything already on screen is shown at once, so nothing visible ever blinks out.
    const rect = el.getBoundingClientRect()
    if (rect.top < innerHeight && rect.bottom > 0) el.classList.add('is-revealed')
    else io.observe(el)
  }

  document.querySelectorAll('[data-reveal]').forEach(watch)
  root.classList.add('js-reveal')

  // New routes mount new sections; watch those too.
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      r.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return
        if (node.matches('[data-reveal]')) watch(node)
        node.querySelectorAll('[data-reveal]').forEach(watch)
      })
    }
  })
  mo.observe(document.body, { childList: true, subtree: true })

  return () => {
    io.disconnect()
    mo.disconnect()
  }
}
