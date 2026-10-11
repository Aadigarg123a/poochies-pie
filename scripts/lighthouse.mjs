// Lighthouse (mobile, simulated throttling) against a running production server.
// Runs each page RUNS times and reports the median, since single runs are noisy.
//
//   pnpm build && pnpm start --port 3300 &
//   node scripts/lighthouse.mjs http://localhost:3300
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'

const base = process.argv[2] ?? 'http://localhost:3300'
const RUNS = Number(process.env.RUNS ?? 3)
const PAGES = { home: '/', menu: '/menu', atelier: '/atelier' }
const CATS = ['performance', 'accessibility', 'best-practices', 'seo']
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]

mkdirSync('lighthouse', { recursive: true })
let failed = false
for (const [name, path] of Object.entries(PAGES)) {
  const runs = []
  for (let i = 0; i < RUNS; i++) {
    const out = `lighthouse/${name}-${i + 1}.json`
    execFileSync('pnpm', ['dlx', 'lighthouse@latest', base + path, `--only-categories=${CATS.join(',')}`, '--output=json', `--output-path=${out}`, '--chrome-flags=--headless=new', '--quiet'], { stdio: 'ignore' })
    const r = JSON.parse(readFileSync(out, 'utf8'))
    runs.push({
      scores: Object.fromEntries(CATS.map((c) => [c, Math.round(r.categories[c].score * 100)])),
      lcp: r.audits['largest-contentful-paint'].numericValue,
      tbt: r.audits['total-blocking-time'].numericValue,
      cls: r.audits['cumulative-layout-shift'].numericValue,
    })
  }
  const scores = Object.fromEntries(CATS.map((c) => [c, median(runs.map((r) => r.scores[c]))]))
  const line = `${name.padEnd(8)} ${CATS.map((c) => `${c}=${scores[c]}`).join(' ')} · LCP ${Math.round(median(runs.map((r) => r.lcp)))}ms · TBT ${Math.round(median(runs.map((r) => r.tbt)))}ms · CLS ${median(runs.map((r) => r.cls)).toFixed(3)} · perf runs [${runs.map((r) => r.scores.performance).join(', ')}]`
  console.log(line)
  if (CATS.some((c) => scores[c] < 95)) failed = true
}
process.exit(failed ? 1 : 0)
