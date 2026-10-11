'use client'

import { usePathname } from 'next/navigation'
import { ChatIcon } from '@/components/ui/icons'
import { whatsappLink } from '@/data/site'
import { cn } from '@/lib/cn'

/** Discreet WhatsApp concierge: an oxblood seal, not a green blob. */
export function ConciergeButton() {
  // The Atelier has its own sticky action bar on phones; keep the corner clear there.
  const hideOnPhone = usePathname() === '/atelier'
  return (
    <a
      href={whatsappLink("Hello Poochie's Pie! I have a question.")}
      className={cn(
        'group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-oxblood pl-3.5 pr-3.5 text-cream shadow-[0_8px_30px_-12px_rgb(92_33_24/0.6)] ring-1 ring-cream/30 transition-[transform,background-color] duration-500 ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:bg-oxblood-deep sm:right-6 sm:pr-5 print:hidden',
        hideOnPhone && 'max-lg:hidden',
      )}
      data-concierge
    >
      <ChatIcon size={22} />
      <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] sm:inline">Concierge</span>
      <span className="sr-only">Chat with Poochie&rsquo;s Pie on WhatsApp</span>
    </a>
  )
}
