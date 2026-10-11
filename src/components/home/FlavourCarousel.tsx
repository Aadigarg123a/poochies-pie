import Link from 'next/link'
import { DietMark } from '@/components/ui/Badges'
import { ArrowIcon } from '@/components/ui/icons'
import { CAKE, FLAVOURS, MINI_CAKE } from '@/data/menu'
import { formatINR } from '@/lib/format'
import { CarouselControls } from './CarouselControls'

const CARD_STYLES = [
  { bg: 'linear-gradient(165deg, #fbe3da 0%, #f7b7a3 100%)', ink: 'text-oxblood-deep' },
  { bg: 'linear-gradient(165deg, #fdf8f2 0%, #f4e6da 100%)', ink: 'text-oxblood' },
  { bg: 'linear-gradient(165deg, #8e3a2b 0%, #5c2118 100%)', ink: 'text-cream' },
] as const

/** The nine flavours, presented like perfume notes. CSS scroll-snap; buttons are an enhancement. */
export function FlavourCarousel() {
  return (
    <section aria-labelledby="flavours-title" className="section-y overflow-hidden">
      <div className="container-page page-x">
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
          <div className="max-w-xl">
            <p className="label">Signature flavours</p>
            <h2 id="flavours-title" className="mt-4 text-title">
              Nine notes, <em className="font-light">worn like perfume.</em>
            </h2>
          </div>
          <CarouselControls targetId="flavour-track" />
        </div>
      </div>
      <ul
        id="flavour-track"
        tabIndex={0}
        aria-label="Signature flavours (scrolls sideways)"
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[max(1rem,calc((100vw-76rem)/2+3rem))] pb-4 [scrollbar-width:none] focus-visible:outline-offset-[-4px] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {FLAVOURS.map((f, i) => {
          const style = CARD_STYLES[i % CARD_STYLES.length]
          const dark = style.ink === 'text-cream'
          return (
            <li key={f.id} className="w-[78%] shrink-0 snap-start xs:w-[60%] sm:w-[42%] lg:w-[29%] xl:w-[24%]">
              <article
                className={`group relative flex aspect-[4/5] flex-col justify-between rounded-[2px] p-6 ${style.ink}`}
                style={{ background: style.bg }}
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[1px] border border-current opacity-20" />
                <div className="relative flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] opacity-90">
                    No. {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={dark ? 'rounded-full bg-cream px-2 py-1' : ''}>
                    <DietMark diet={f.diet} />
                  </span>
                </div>
                <div className="relative">
                  <h3 className="font-display text-[clamp(1.9rem,3vw,2.4rem)] italic leading-[1.05] text-current">{f.name}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-snug opacity-95">{f.note}</p>
                </div>
                <div className="relative flex items-end justify-between gap-3 border-t border-current/25 pt-4 text-sm">
                  <p className="price">
                    <span className="block">½ kg {formatINR(CAKE.halfKgPrices[f.id])}</span>
                    <span className="block opacity-90">Mini {formatINR(MINI_CAKE.prices[f.id])}</span>
                  </p>
                  <Link
                    href={`/atelier?flavour=${f.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] after:absolute after:inset-0 after:content-['']"
                  >
                    Build <ArrowIcon size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
                    <span className="sr-only">a {f.name} cake</span>
                  </Link>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
