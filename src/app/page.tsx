import { Wordmark } from '@/components/layout/Wordmark'
import { SITE } from '@/data/site'

export default function HomePage() {
  return (
    <section className="container-page page-x section-y text-center">
      <p className="label">{SITE.tagline}</p>
      <h1 className="mt-6 text-display">
        <Wordmark />
      </h1>
    </section>
  )
}
