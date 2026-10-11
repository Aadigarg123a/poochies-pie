import { describe, expect, it } from 'vitest'
import { findClaims, readableCopy } from '../../scripts/copy-audit'

describe('copy audit', () => {
  it('catches unbacked claims in text, attributes and JSON-LD', () => {
    const html = `<html><head><meta name="description" content="The best in Delhi"></head><body>
      <p>Our vet-approved, award-winning, 5-star cakes. Read our reviews!</p>
      <img alt="FSSAI certified #1">
      <script>self.__next_f.push("award")</script>
      <script type="application/ld+json">{"aggregateRating":"rated 4.9"}</script></body></html>`
    const rules = findClaims(readableCopy(html)).map((c) => c.rule)
    for (const r of ['vet claims', 'award', 'star rating', 'reviews', 'FSSAI', 'certified', 'number one', 'best in']) {
      expect(rules, r).toContain(r)
    }
    // Framework payload scripts are not "copy".
    expect(rules.filter((r) => r === 'award')).toHaveLength(1)
  })

  it('leaves ordinary copy alone and honours the allowlist', () => {
    expect(findClaims(readableCopy('<p>Preview the message. No sugar, no salt. Box of 4.</p>'))).toEqual([])
    const copy = readableCopy('<p>Customer reviews are coming soon.</p>')
    expect(findClaims(copy)).toHaveLength(1)
    expect(findClaims(copy, [{ phrase: 'reviews are coming soon', reason: 'placeholder' }])).toEqual([])
  })
})
