'use client'

import { useRef, type PointerEvent, type ReactNode } from 'react'

/**
 * Lets a button drift a few pixels toward the pointer. Mouse/pen only, and
 * disabled under prefers-reduced-motion. Purely decorative: no layout change.
 */
export function Magnetic({ children, strength = 0.22, max = 10 }: { children: ReactNode; strength?: number; max?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current
    if (!el || e.pointerType === 'touch' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const clamp = (v: number) => Math.max(-max, Math.min(max, v))
    const x = clamp((e.clientX - (r.left + r.width / 2)) * strength)
    const y = clamp((e.clientY - (r.top + r.height / 2)) * strength)
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  const reset = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className="inline-flex transition-transform duration-500 ease-[var(--ease-soft)] will-change-transform"
    >
      {children}
    </span>
  )
}
