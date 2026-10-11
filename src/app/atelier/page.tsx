import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AtelierBuilder, AtelierBuilderFallback } from '@/components/atelier/AtelierBuilder'

export const metadata: Metadata = {
  title: 'The Atelier: build a custom dog cake with a name',
  description:
    'Design a custom dog or cat birthday cake in Delhi: choose the size, flavour, frosting, face and a name banner, and see the price as you go. Sugar-free, made to order.',
  alternates: { canonical: '/atelier' },
}

export default function AtelierPage() {
  return (
    <div className="container-page page-x">
      <header className="max-w-2xl pb-10 pt-12 sm:pt-16">
        <p className="label">The Atelier · Cake builder</p>
        <h1 className="mt-5 text-display">
          Design the cake<span className="font-light italic text-rose">.</span>
        </h1>
        <p className="mt-6 text-lg text-muted">
          Six small decisions, one remarkable cake. Every price comes straight from our menu, and nothing is charged here: you’ll
          send the order to us on WhatsApp.
        </p>
      </header>
      <Suspense fallback={<AtelierBuilderFallback />}>
        <AtelierBuilder />
      </Suspense>
    </div>
  )
}
