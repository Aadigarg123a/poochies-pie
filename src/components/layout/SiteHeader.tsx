import Link from 'next/link'
import { CartButton } from '@/components/cart/CartButton'
import { MobileNav } from './MobileNav'
import { NavLinks } from './NavLinks'
import { Wordmark } from './Wordmark'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b hairline bg-cream/90 backdrop-blur-md">
      <div className="container-page page-x flex h-16 items-center gap-4">
        <div className="flex flex-1 items-center lg:hidden">
          <MobileNav />
        </div>
        <Link href="/" className="shrink-0 rounded-sm text-[1.65rem] lg:flex-1" aria-label="Poochie's Pie, home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks />
        </nav>
        <div className="flex flex-1 items-center justify-end">
          <CartButton />
        </div>
      </div>
    </header>
  )
}
