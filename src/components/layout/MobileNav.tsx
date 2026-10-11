'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { MenuIcon } from '@/components/ui/icons'
import { SITE, whatsappLink } from '@/data/site'
import { NavLinks } from './NavLinks'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="-ml-2 inline-flex size-11 items-center justify-center rounded-full text-oxblood transition-colors hover:bg-linen"
      >
        <MenuIcon />
        <span className="sr-only">Open navigation</span>
      </button>
      <Drawer open={open} onClose={close} title="Navigation" hideTitle side="left">
        <nav aria-label="Main">
          <NavLinks variant="sheet" onNavigate={close} />
        </nav>
        <div className="mt-10 space-y-3 border-t hairline pt-6 text-sm">
          <Link href="/faq" onClick={close} className="block text-ink underline-offset-4 hover:underline">
            FAQ
          </Link>
          <Link href="/contact" onClick={close} className="block text-ink underline-offset-4 hover:underline">
            Contact
          </Link>
          <a href={whatsappLink()} className="block text-ink underline-offset-4 hover:underline">
            WhatsApp {SITE.whatsapp.display}
          </a>
          <a href={SITE.instagram.url} className="block text-ink underline-offset-4 hover:underline">
            Instagram {SITE.instagram.handle}
          </a>
        </div>
      </Drawer>
    </>
  )
}
