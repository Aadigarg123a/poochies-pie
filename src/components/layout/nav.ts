export const MAIN_NAV = [
  { href: '/menu', label: 'Menu' },
  { href: '/atelier', label: 'Atelier' },
  { href: '/pawrty', label: 'Pawrty' },
  { href: '/how-to-order', label: 'How to order' },
  { href: '/about', label: 'About' },
] as const

export const FOOTER_NAV = {
  shop: [
    { href: '/menu', label: 'The Menu' },
    { href: '/atelier', label: 'The Atelier: build a cake' },
    { href: '/pawrty', label: 'Pawrty Planner' },
    { href: '/atelier?gift=1', label: 'Gift a Pup-cake' },
  ],
  help: [
    { href: '/how-to-order', label: 'How to order' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
} as const
