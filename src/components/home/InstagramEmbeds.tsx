'use client'

import { useState } from 'react'
import { InstagramIcon } from '@/components/ui/icons'

/**
 * Official Instagram embeds behind a click-to-load facade: nothing from
 * Instagram (scripts, cookies) loads until the visitor asks for it.
 */
export function InstagramEmbeds({ urls }: { urls: readonly string[] }) {
  return (
    <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {urls.map((url) => (
        <li key={url}>
          <Embed url={url} />
        </li>
      ))}
    </ul>
  )
}

function Embed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false)
  const src = `${url.replace(/\/?$/, '/')}embed/`
  if (loaded) {
    return <iframe src={src} title="Instagram post by @poochiespie" loading="lazy" className="aspect-[4/5] w-full rounded-[2px] bg-cream" />
  }
  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-[2px] border border-field/50 bg-cream text-oxblood transition-colors hover:bg-blush-mist"
    >
      <InstagramIcon size={28} />
      <span className="text-xs font-semibold uppercase tracking-[0.18em]">Load Instagram post</span>
      <span className="max-w-[80%] text-xs text-muted">Loads content from Instagram</span>
    </button>
  )
}
