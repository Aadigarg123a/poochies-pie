import { PROMISE } from '@/data/site'

const WORDS: Record<string, { word: string; aside?: string }> = {
  sugar: { word: 'Sugar', aside: 'or fondant' },
  salt: { word: 'Salt' },
  cocoa: { word: 'Cocoa', aside: 'powder' },
  preservatives: { word: 'Preservatives' },
}

/** "Never in it": the four promises, struck through like edits on a printed menu. */
export function PromiseStrip() {
  return (
    <section aria-labelledby="promise-title" className="border-y hairline bg-linen">
      <div className="container-page page-x grid gap-10 py-14 sm:py-16 lg:grid-cols-[0.9fr_2fr] lg:items-center">
        <div data-reveal>
          <p className="label">The promise</p>
          <h2 id="promise-title" className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            {PROMISE.intro}
            <span className="block italic text-rose">Never in it:</span>
          </h2>
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {PROMISE.never.map((p, i) => {
            const w = WORDS[p.id]
            return (
              <li key={p.id} data-reveal style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}>
                <span className="sr-only">{p.label}</span>
                <span aria-hidden="true" className="block">
                  <span className="relative inline-block font-display text-[clamp(1.6rem,3.6vw,2.4rem)] italic leading-none text-oxblood">
                    {w.word}
                    <span className="strike absolute left-[-6%] top-[54%] h-[1.5px] w-[112%] origin-left -rotate-3 bg-oxblood" />
                  </span>
                  <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {w.aside ? `No ${w.word.toLowerCase()} ${w.aside}` : `No ${w.word.toLowerCase()}`}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
