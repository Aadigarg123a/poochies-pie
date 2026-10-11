// Downloads tightly subset display fonts from the Google Fonts API (OFL) into
// src/fonts/, for next/font/local. Subsetting to the characters the site uses
// keeps the critical font payload small on mobile.
//
//   node scripts/fetch-fonts.mjs
//
// Re-run if the copy starts using new characters in the display serif or the
// wordmark script (anything outside DISPLAY_TEXT falls back to the serif stack).
import { mkdir, writeFile } from 'node:fs/promises'

const ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('')
const DISPLAY_TEXT = ASCII + '½₹’‘“”–—…·•×°âêîôûàèéùçëïüÉ'
const WORDMARK_TEXT = "Poochie’s Pie'PHappy Birthday"

const FONTS = [
  { file: 'fraunces-400.woff2', family: 'Fraunces:wght@400', text: DISPLAY_TEXT },
  { file: 'fraunces-300-italic.woff2', family: 'Fraunces:ital,wght@1,300', text: DISPLAY_TEXT },
  { file: 'pacifico-wordmark.woff2', family: 'Pacifico', text: WORDMARK_TEXT },
  // UI sans: variable 400–600 (regular to semibold), including ₹ so no extra subset loads.
  { file: 'manrope-400-600.woff2', family: 'Manrope:wght@400..600', text: DISPLAY_TEXT },
]

// A modern desktop UA makes the API serve woff2.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'

await mkdir('src/fonts', { recursive: true })
for (const f of FONTS) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${f.family}&text=${encodeURIComponent(f.text)}&display=swap`,
    { headers: { 'user-agent': UA } },
  ).then((r) => {
    if (!r.ok) throw new Error(`${f.family}: ${r.status}`)
    return r.text()
  })
  const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/)?.[1]
  if (!url) throw new Error(`${f.family}: no woff2 in response`)
  const buf = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()))
  await writeFile(`src/fonts/${f.file}`, buf)
  console.log(`${f.file}: ${(buf.length / 1024).toFixed(1)} KB`)
}
