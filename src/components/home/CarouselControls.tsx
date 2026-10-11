'use client'

import { ChevronIcon } from '@/components/ui/icons'

export function CarouselControls({ targetId }: { targetId: string }) {
  const scroll = (dir: 1 | -1) => {
    const track = document.getElementById(targetId)
    if (!track) return
    const card = track.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth * 0.8
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' })
  }
  const btn =
    'inline-flex size-12 items-center justify-center rounded-full border border-field/60 text-oxblood transition-colors hover:border-oxblood hover:bg-oxblood hover:text-cream'
  return (
    <div className="flex gap-3">
      <button type="button" aria-controls={targetId} onClick={() => scroll(-1)} className={btn}>
        <ChevronIcon className="rotate-180" />
        <span className="sr-only">Previous flavours</span>
      </button>
      <button type="button" aria-controls={targetId} onClick={() => scroll(1)} className={btn}>
        <ChevronIcon />
        <span className="sr-only">Next flavours</span>
      </button>
    </div>
  )
}
