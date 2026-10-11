import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { BrushStroke } from '@/components/ui/Typography'
import { Seal, Wordmark } from '@/components/layout/Wordmark'
import { HERO_PHOTO } from '@/data/photos'
import { SITE } from '@/data/site'
import { HeroCake } from './HeroCake'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-page page-x grid items-center gap-8 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.08fr_1fr] lg:gap-6 lg:pb-24 lg:pt-16">
        <div className="relative z-10 max-w-xl">
          <p className="label">{SITE.tagline}</p>
          <h1 id="hero-title" className="mt-6">
            <Wordmark className="block text-[clamp(3.6rem,13vw,7.25rem)] leading-[1.02]" />
            <span className="mt-4 block font-display text-[clamp(1.75rem,4.2vw,2.75rem)] font-light italic leading-[1.1] text-oxblood">
              Haute pâtisserie for pets
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/85">
            Fresh, made-to-order pup-cakes and treats for dogs and cats, baked in Delhi and delivered to your doorstep. Never
            with sugar, salt, cocoa or preservatives.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink href="/atelier" size="lg" magnetic arrow>
              Build your cake
            </ButtonLink>
            <ButtonLink href="/menu" variant="ghost">
              View the menu
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-muted">Order 1–2 days ahead · Delivery or pick-up · {SITE.areaServed}</p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <BrushStroke className="hero-drift-slow absolute left-[-8%] top-[42%] h-[30%] w-[116%]" />
          <Seal size={112} className="seal-spin absolute right-[2%] top-[2%] z-10 text-rose sm:right-[6%]" />
          {HERO_PHOTO ? (
            <div className="hero-drift relative aspect-[4/5] overflow-hidden rounded-[2px]">
              <Image src={HERO_PHOTO.src} alt={HERO_PHOTO.alt} fill preload sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
            </div>
          ) : (
            <HeroCake className="hero-drift relative mx-auto w-[88%] max-w-[30rem]" />
          )}
        </div>
      </div>
    </section>
  )
}
