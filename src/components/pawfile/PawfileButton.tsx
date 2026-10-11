'use client'

import { HeartIcon } from '@/components/ui/icons'
import { usePawfileStore } from '@/stores/pawfile'
import { useUIStore } from '@/stores/ui'

export function PawfileButton() {
  const name = usePawfileStore((s) => s.pawfile?.name)
  const open = useUIStore((s) => s.openPawfile)
  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      className="relative inline-flex h-11 items-center gap-2 rounded-full px-3 text-oxblood transition-colors hover:bg-linen"
    >
      <HeartIcon className={name ? 'fill-blush' : undefined} />
      <span className="hidden max-w-28 truncate text-[0.8125rem] font-semibold uppercase tracking-[0.16em] sm:inline">{name || 'Pawfile'}</span>
      <span className="sr-only sm:hidden">{name ? `${name}’s Pawfile` : 'Pawfile'}</span>
    </button>
  )
}
