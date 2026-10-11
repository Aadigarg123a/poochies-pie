'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MAIN_NAV } from './nav'

export function NavLinks({ onNavigate, variant = 'bar' }: { onNavigate?: () => void; variant?: 'bar' | 'sheet' }) {
  const pathname = usePathname()
  return (
    <ul className={variant === 'bar' ? 'flex items-center gap-7 xl:gap-9' : 'flex flex-col gap-1'}>
      {MAIN_NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={
                variant === 'bar'
                  ? 'relative py-2 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:text-oxblood aria-[current=page]:text-oxblood after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-oxblood after:transition-transform after:duration-500 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100'
                  : 'block py-3 font-display text-4xl text-oxblood aria-[current=page]:italic'
              }
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
