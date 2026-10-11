'use client'

import { useSyncExternalStore } from 'react'

/*
 * The current time, read only in the browser. During prerender (and the
 * hydration pass) it is null, so no build-time date is ever baked into HTML.
 * It refreshes every minute so a tab left open past midnight stays correct.
 */
let cached: { minute: number; date: Date } | null = null

function getSnapshot(): Date {
  const minute = Math.floor(Date.now() / 60_000)
  if (!cached || cached.minute !== minute) cached = { minute, date: new Date() }
  return cached.date
}

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000)
  return () => clearInterval(timer)
}

export function useClientNow(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}
