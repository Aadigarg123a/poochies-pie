import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const ROUTES = [
  '/',
  '/menu',
  '/menu?diet=veg&pet=cat',
  '/atelier',
  '/atelier?gift=1',
  '/pawrty',
  '/how-to-order',
  '/faq',
  '/about',
  '/contact',
  '/treats/celebration-cake',
  '/treats/special-mini-cake',
  '/treats/rainbow-cupcakes',
  '/treats/pup-icecream',
  '/treats/cat-bow-tie',
  '/no-such-page',
]

// Scroll reveals are skipped under reduced motion, so every section is visible to axe.
test.use({ reducedMotion: 'reduce' })

async function axe(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .disableRules(['region']) // decorative fixed elements (concierge) are outside landmarks by design
    .analyze()
  return results.violations.map((v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)
}

for (const route of ROUTES) {
  test(`axe: ${route}`, async ({ page }) => {
    await page.goto(route)
    await page.waitForLoadState('networkidle')
    expect(await axe(page)).toEqual([])
  })
}

test('axe: bag and Pawfile dialogs', async ({ page }) => {
  await page.goto('/treats/tuxedo-bandana')
  await page.getByRole('button', { name: 'Add to bag' }).click()
  await expect(page.getByRole('dialog', { name: 'Your bag' })).toBeVisible()
  expect(await axe(page)).toEqual([])
  await page.getByRole('button', { name: /Continue: date & details/ }).click()
  await expect(page.getByRole('dialog', { name: 'Date & details' })).toBeVisible()
  await page.getByRole('grid').waitFor()
  expect(await axe(page)).toEqual([])
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: /Pawfile/ }).first().click()
  await expect(page.getByRole('dialog', { name: 'Pawfile' })).toBeVisible()
  expect(await axe(page)).toEqual([])
})

test.describe('no horizontal scroll from 360px to 1920px', () => {
  test.skip(({ isMobile }) => isMobile, 'viewport sizes are set explicitly')
  for (const width of [360, 768, 1280, 1920]) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      for (const route of ROUTES) {
        await page.goto(route)
        const { scroll, client } = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          client: document.documentElement.clientWidth,
        }))
        expect(scroll, `${route} at ${width}px`).toBeLessThanOrEqual(client)
      }
    })
  }
})

test.describe('keyboard', () => {
  test.skip(({ isMobile }) => isMobile, 'keyboard flows run on desktop')

  test('skip link, bag dialog focus trap and focus return', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main$/)

    const bagButton = page.getByRole('button', { name: /Open your bag/ })
    await bagButton.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'Your bag' })
    await expect(dialog).toBeVisible()
    // Focus is inside the dialog and stays there.
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
    }
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(bagButton).toBeFocused()
  })

  test('the builder works with the keyboard alone', async ({ page }) => {
    await page.goto('/atelier')
    await page.waitForLoadState('networkidle') // hydrated: the live builder has replaced the prerendered one
    const firstSize = page.getByRole('radio', { name: /Special Mini/ })
    await firstSize.focus()
    await page.keyboard.press('Space')
    await expect(firstSize).toBeChecked()
    await page.keyboard.press('ArrowDown')
    await expect(page.getByRole('radio', { name: /½ kg/ })).toBeChecked()
    await page.getByRole('button', { name: /^Next: Flavour/ }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Choose the flavour' })).toBeFocused()
    const flavour = page.getByRole('radio', { name: /Going Bananas/ })
    await flavour.focus()
    await page.keyboard.press('Space')
    await expect(flavour).toBeChecked()
    await expect(page.getByTestId('builder-total')).toHaveText('₹1,100')
  })
})
