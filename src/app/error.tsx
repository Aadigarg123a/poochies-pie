'use client'

import { whatsappLink } from '@/data/site'

export default function RouteError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="container-page page-x py-24 text-center">
      <p className="label">Something went wrong</p>
      <h1 className="mt-6 text-title">A crumb fell in the works.</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">Please try again. If it keeps happening, you can always order on WhatsApp.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button type="button" onClick={retry} className="min-h-11 bg-oxblood px-6 text-xs font-semibold uppercase tracking-[0.16em] text-cream">
          Try again
        </button>
        <a href={whatsappLink()} className="inline-flex min-h-11 items-center px-4 text-xs font-semibold uppercase tracking-[0.16em] text-oxblood underline underline-offset-4">
          WhatsApp us
        </a>
      </div>
    </div>
  )
}
