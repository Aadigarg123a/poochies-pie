import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/Button'
import { BrushStroke } from '@/components/ui/Typography'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="container-page page-x relative overflow-hidden py-24 text-center sm:py-32">
      <BrushStroke className="absolute left-1/2 top-24 h-24 w-[min(40rem,90vw)] -translate-x-1/2 opacity-60" />
      <p className="label relative">Error 404</p>
      <h1 className="relative mt-6 text-display">
        This page has been <em className="font-light">eaten.</em>
      </h1>
      <p className="relative mx-auto mt-6 max-w-md text-lg text-muted">
        We suspect a very good dog. Let&rsquo;s get you back to something delicious.
      </p>
      <div className="relative mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/" arrow>
          Back home
        </ButtonLink>
        <ButtonLink href="/menu" variant="secondary">
          See the menu
        </ButtonLink>
      </div>
    </div>
  )
}
