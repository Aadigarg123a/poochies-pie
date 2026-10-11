/**
 * Copy audit: fails if the rendered site makes claims we can't back up.
 * Scans the built HTML (visible text, alt/aria-label/title, meta content and
 * JSON-LD) for banned phrases. Exceptions must be listed, with a reason, in
 * scripts/copy-audit.allow.json.
 *
 *   pnpm build && pnpm copy:audit
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

export const BANNED: { id: string; pattern: RegExp }[] = [
  { id: 'vet claims', pattern: /\bvet(?:erinarian)?[\s-]*(?:approved|recommended|certified|endorsed)\b/gi },
  { id: 'certified', pattern: /\bcertifi(?:ed|cation)\b/gi },
  { id: 'FSSAI', pattern: /\bfssai\b/gi },
  { id: 'award', pattern: /\baward(?:s|-winning)?\b/gi },
  { id: 'star rating', pattern: /\b(?:5|five)[\s-]*stars?\b/gi },
  { id: 'number one', pattern: /(?:#\s?1\b|\bno\.?\s?1\b|\bnumber one\b)/gi },
  { id: 'best in', pattern: /\bbest\s+(?:in|of)\s+(?:delhi|ncr|india|town|the city)\b/gi },
  { id: 'reviews', pattern: /\b(?:reviews?|reviewed|testimonials?|rated)\b/gi },
  { id: 'organic', pattern: /\borganic\b/gi },
  { id: 'guarantee', pattern: /\bguarantee(?:d|s)?\b/gi },
]

export interface Allow {
  phrase: string
  reason: string
}

const ROOT = join(process.cwd(), '.next/server/app')

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return htmlFiles(path)
    return name.endsWith('.html') ? [path] : []
  })
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')

/** Everything a person or a crawler can read on the page. */
export function readableCopy(html: string): string {
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])
  const attrs = [...html.matchAll(/\s(?:alt|aria-label|title|placeholder|content)="([^"]*)"/g)].map((m) => m[1])
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
  return decode([text, ...attrs, ...jsonLd].join('\n')).replace(/\s+/g, ' ')
}

/** Banned phrases found in readable copy, minus allowlisted contexts. */
export function findClaims(copy: string, allow: readonly Allow[] = []): { rule: string; context: string }[] {
  const out: { rule: string; context: string }[] = []
  for (const rule of BANNED) {
    for (const m of copy.matchAll(rule.pattern)) {
      const context = copy.slice(Math.max(0, m.index! - 60), m.index! + m[0].length + 60).trim()
      if (allow.some((a) => context.toLowerCase().includes(a.phrase.toLowerCase()))) continue
      out.push({ rule: rule.id, context })
    }
  }
  return out
}

function main() {
  const allow: Allow[] = JSON.parse(readFileSync(join(process.cwd(), 'scripts/copy-audit.allow.json'), 'utf8'))
  let files: string[]
  try {
    files = htmlFiles(ROOT)
  } catch {
    console.error('✗ No build found. Run `pnpm build` first.')
    process.exit(1)
  }
  const problems: string[] = []
  for (const file of files) {
    for (const c of findClaims(readableCopy(readFileSync(file, 'utf8')), allow)) {
      problems.push(`${relative(ROOT, file)} · ${c.rule}: “…${c.context}…”`)
    }
  }
  if (problems.length) {
    console.error(`✗ Copy audit failed (${problems.length}):\n${problems.map((p) => `  - ${p}`).join('\n')}`)
    console.error('\nRemove the claim, or add an allowlist entry with a reason in scripts/copy-audit.allow.json.')
    process.exit(1)
  }
  console.log(`✓ Copy audit passed: ${files.length} pages, ${BANNED.length} rules, ${allow.length} allowlisted phrases.`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main()
