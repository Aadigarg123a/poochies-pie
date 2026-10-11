'use client'

import { BagIcon } from '@/components/ui/icons'
import { cartCount, useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'

export function CartButton() {
  const count = useCartStore((s) => cartCount(s.lines))
  const openCart = useUIStore((s) => s.openCart)
  return (
    <button
      type="button"
      onClick={openCart}
      aria-haspopup="dialog"
      data-testid="cart-button"
      className="group relative -mr-2 inline-flex h-11 items-center gap-2 rounded-full px-3 text-oxblood transition-colors hover:bg-linen"
    >
      <BagIcon />
      <span className="hidden text-[0.8125rem] font-semibold uppercase tracking-[0.16em] sm:inline">Bag</span>
      <span
        aria-hidden="true"
        className={`price min-w-5 rounded-full px-1.5 text-center text-sm leading-5 transition-colors ${count ? 'bg-oxblood text-cream' : 'text-muted'}`}
      >
        {count}
      </span>
      <span className="sr-only">{count === 1 ? 'Open your bag, 1 item' : `Open your bag, ${count} items`}</span>
    </button>
  )
}
