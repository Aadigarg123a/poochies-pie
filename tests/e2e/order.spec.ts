import { expect, test, type Locator, type Page } from '@playwright/test'

/** Click the card (label) that wraps a visually hidden radio/checkbox. */
async function pick(control: Locator) {
  await control.locator('xpath=ancestor::label[1]').click()
  await expect(control).toBeChecked()
}

/** Text on the current route only (previous routes stay mounted but hidden). */
function visibleText(page: Page, text: string) {
  return page.getByText(text).filter({ visible: true })
}

async function next(page: Page) {
  await page.getByRole('button', { name: /^Next/ }).click()
}

test('Home → Menu filter → Atelier build → Bag → WhatsApp link', async ({ page }) => {
  // Home
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Haute pâtisserie for pets')
  await page.getByRole('link', { name: 'View the menu' }).click()

  // Menu: filter to veg
  await expect(page).toHaveURL(/\/menu$/)
  await expect(page.getByRole('heading', { name: 'The Menu.' })).toBeVisible()
  await expect(visibleText(page, 'Chicken Overloaded').first()).toBeVisible()
  await page.getByRole('button', { name: 'Veg', exact: true }).click()
  await expect(page).toHaveURL(/diet=veg/)
  await expect(page.getByRole('button', { name: 'Veg', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(visibleText(page, 'Chicken Overloaded')).toHaveCount(0)
  await expect(visibleText(page, 'Going Bananas').first()).toBeVisible()

  // Atelier
  await page.getByRole('link', { name: 'Build your cake' }).first().click()
  await expect(page).toHaveURL(/\/atelier/)
  await expect(page.getByRole('heading', { name: 'Choose the size' })).toBeVisible()

  await pick(page.getByRole('radio', { name: /½ kg/ }))
  await next(page)
  await expect(page.getByRole('heading', { name: 'Choose the flavour' })).toBeVisible()
  await pick(page.getByRole('radio', { name: /Mutton Delight/ }))
  await next(page)
  await expect(page.getByRole('heading', { name: 'Choose the frosting' })).toBeVisible()
  await expect(page.getByRole('radio', { name: /Cream cheese/ })).toBeChecked()
  await next(page)
  await expect(page.getByRole('heading', { name: 'The finishing touches' })).toBeVisible()
  await pick(page.getByRole('checkbox', { name: /Paw Design/ }))
  await next(page)
  await expect(page.getByRole('heading', { name: 'A name on the banner' })).toBeVisible()
  await pick(page.getByRole('checkbox', { name: /Add a Name Banner/ }))
  await page.getByRole('textbox', { name: 'Banner text' }).fill('Happy Birthday Bruno')
  await next(page)
  await expect(page.getByRole('heading', { name: 'Who is it for?' })).toBeVisible()
  await page.getByRole('textbox', { name: 'Your pet’s name' }).fill('Bruno')

  // 1250 + 60 + 100
  await expect(visibleText(page, '₹1,410').first()).toBeVisible()
  await page.getByRole('button', { name: 'Add to bag' }).click()

  // Bag
  const bag = page.getByRole('dialog', { name: 'Your bag' })
  await expect(bag).toBeVisible()
  await expect(bag.getByText('½ kg cake · Mutton Delight', { exact: true })).toBeVisible()
  await expect(bag.getByText('₹1,410').first()).toBeVisible()
  await bag.getByRole('button', { name: /Continue: date & details/ }).click()

  // Details
  const details = page.getByRole('dialog', { name: 'Date & details' })
  await expect(details).toBeVisible()
  await expect(details.getByRole('link', { name: 'Send order on WhatsApp' })).toHaveCount(0)
  await details.getByRole('button', { name: /recommended/ }).click()
  await details.getByRole('textbox', { name: 'Delivery area or locality' }).fill('Vasant Vihar')
  await expect(details.getByRole('textbox', { name: 'Pet’s name' })).toHaveValue('Bruno')

  const send = details.getByRole('link', { name: 'Send order on WhatsApp' })
  await expect(send).toBeVisible()
  const href = await send.getAttribute('href')
  expect(href).toMatch(/^https:\/\/wa\.me\/919810015052\?text=/)
  const text = new URL(href!).searchParams.get('text')!
  expect(text).toContain('1. ½ kg cake · Mutton Delight: ₹1,250')
  expect(text).toContain('Frosting: Cream cheese')
  expect(text).toContain('Banner: “Happy Birthday Bruno”')
  expect(text).toContain('+ Paw Design: ₹60')
  expect(text).toContain('+ Name Banner: ₹100')
  expect(text).toContain('*Total: ₹1,410* (plus delivery charges)')
  expect(text).toContain('*Delivery to:* Vasant Vihar')
  expect(text).toContain('*Pet:* Bruno (dog)')
  expect(text).toMatch(/\*Date:\* \w{3}, \d{1,2} \w{3} \d{4}/)
  expect(text).toContain('confirmed after advance payment')
  // The payment rule sits right next to the button.
  await expect(details.getByText(/Orders are confirmed only after advance online payment/)).toBeVisible()
})

test('date picker refuses today and accepts tomorrow', async ({ page }) => {
  await page.goto('/atelier?size=mini&flavour=carrot-twist')
  await expect(page.getByRole('heading', { name: 'Choose the frosting' })).toBeVisible()
  await next(page)
  await next(page)
  await next(page)
  await page.getByRole('textbox', { name: 'Your pet’s name' }).fill('Coco')
  await page.getByRole('button', { name: 'Add to bag' }).click()
  await page.getByRole('dialog', { name: 'Your bag' }).getByRole('button', { name: /Continue/ }).click()
  const details = page.getByRole('dialog', { name: 'Date & details' })
  const today = details.getByRole('button', { name: /, today/ })
  if (await today.count()) {
    await expect(today).toHaveAttribute('aria-disabled', 'true')
    await today.click({ force: true })
    await expect(details.getByText(/Selected:/)).toHaveCount(0)
  }
  // The first enabled day is tomorrow.
  const tomorrow = details.locator('[data-date]:not([aria-disabled])').first()
  await tomorrow.click()
  await expect(details.getByText(/Selected:/)).toBeVisible()
})
