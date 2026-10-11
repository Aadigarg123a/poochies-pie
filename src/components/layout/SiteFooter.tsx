import Link from 'next/link'
import { Todo } from '@/components/ui/Todo'
import { InstagramIcon, ChatIcon, PinIcon } from '@/components/ui/icons'
import { SITE, whatsappLink } from '@/data/site'
import { FOOTER_NAV } from './nav'
import { Wordmark } from './Wordmark'

export function SiteFooter() {
  return (
    <footer className="bg-oxblood text-cream">
      <div className="container-page page-x pb-28 pt-20 sm:pb-16">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark className="text-4xl text-cream" />
            <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-cream/95">
              Made to order in Delhi. Never with sugar, salt, cocoa or preservatives.
            </p>
          </div>
          <FooterList title="Shop" items={FOOTER_NAV.shop} />
          <FooterList title="Help" items={FOOTER_NAV.help} />
          <div>
            <h2 className="label !text-blush">Say hello</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              <li>
                <a href={whatsappLink()} className="inline-flex items-center gap-2.5 underline-offset-4 hover:underline">
                  <ChatIcon size={18} /> WhatsApp {SITE.whatsapp.display}
                </a>
              </li>
              <li>
                <a href={SITE.instagram.url} className="inline-flex items-center gap-2.5 underline-offset-4 hover:underline">
                  <InstagramIcon size={18} /> Instagram {SITE.instagram.handle}
                </a>
              </li>
              <li>
                {SITE.googleProfileUrl ? (
                  <a href={SITE.googleProfileUrl} className="inline-flex items-center gap-2.5 underline-offset-4 hover:underline">
                    <PinIcon size={18} /> Find us on Google
                  </a>
                ) : (
                  <Todo inline>Google Business Profile link</Todo>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-cream/20 pt-6 text-sm text-cream/85 sm:flex-row sm:items-center sm:justify-between">
          <p>© {SITE.name} · A home bakery for dogs &amp; cats · {SITE.areaServed}</p>
          <p>Orders are confirmed after advance payment.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterList({ title, items }: { title: string; items: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="label !text-blush">{title}</h2>
      <ul className="mt-5 space-y-3 text-[0.9375rem]">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="underline-offset-4 hover:underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
