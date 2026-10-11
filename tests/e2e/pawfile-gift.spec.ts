import { expect, test, type Locator, type Page } from '@playwright/test'

async function pick(control: Locator) {
  await control.locator('xpath=ancestor::label[1]').click()
  await expect(control).toBeChecked()
}

const visible = (page: Page, text: string | RegExp) => page.getByText(text).filter({ visible: true })

test('Pawfile flags chicken items on the menu and "safe" hides them', async ({ page }) => {
  await page.goto('/menu')
  await page.getByRole('button', { name: /Safe for my pet · add a Pawfile/ }).click()
  const sheet = page.getByRole('dialog', { name: 'Pawfile' })
  await expect(sheet).toBeVisible()
  await sheet.getByRole('textbox', { name: 'Pet’s name' }).fill('Bruno')
  await pick(sheet.getByRole('checkbox', { name: 'Chicken' }))
  await sheet.getByRole('button', { name: 'Save Pawfile' }).click()
  await expect(sheet.getByRole('status')).toContainText('Saved')
  await page.keyboard.press('Escape')

  await expect(visible(page, 'Contains chicken: Bruno is allergic').first()).toBeVisible()
  await expect(page.getByRole('button', { name: /Bruno/ }).first()).toBeVisible() // header shows the pet

  await page.getByRole('button', { name: 'Safe for Bruno' }).click()
  await expect(page).toHaveURL(/safe=1/)
  await expect(visible(page, 'Chicken Overloaded')).toHaveCount(0)
  await expect(visible(page, 'Mutton Delight').first()).toBeVisible()
  await expect(visible(page, 'Pet-Friendly Beer')).toHaveCount(0)
})

test('Gift a Pup-cake adds the recipient and note to the WhatsApp message', async ({ page }) => {
  await page.goto('/atelier?gift=1&size=mini&flavour=pumpkin-lava')
  await expect(visible(page, /You’re gifting a Pup-cake/)).toBeVisible()
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /^Next/ }).click()
  await expect(page.getByRole('heading', { name: 'Who is it for?' })).toBeVisible()
  await page.getByRole('textbox', { name: 'Gift for (their name)' }).fill('Ananya')
  await page.getByRole('textbox', { name: 'Their pet’s name' }).fill('Coco')
  await page.getByRole('textbox', { name: /Gift note/ }).fill('Happy birthday, Coco!')
  await page.getByRole('textbox', { name: /From \(your name\)/ }).fill('Rhea')
  await page.getByRole('button', { name: 'Add to bag' }).click()

  await page.getByRole('dialog', { name: 'Your bag' }).getByRole('button', { name: /Continue/ }).click()
  const details = page.getByRole('dialog', { name: 'Date & details' })
  await expect(details.getByRole('checkbox', { name: /This is a gift/ })).toBeChecked()
  await details.getByRole('button', { name: /recommended/ }).click()
  await pick(details.getByRole('radio', { name: /Self pick-up/ }))

  const href = await details.getByRole('link', { name: 'Send order on WhatsApp' }).getAttribute('href')
  const text = new URL(href!).searchParams.get('text')!
  expect(text).toContain('Special Mini Cake (250–300 g) · Pumpkin Lava: ₹700')
  expect(text).toContain('*This is a gift* 🎁')
  expect(text).toContain('*For:* Ananya')
  expect(text).toContain('*Their pet:* Coco (dog)')
  expect(text).toContain('*Gift note:* “Happy birthday, Coco!”')
  expect(text).toContain('*From:* Rhea')
  expect(text).toContain('*Self pick-up*')
})

test('Pawrty set total is the plain sum and adds every part', async ({ page }) => {
  await page.goto('/pawrty')
  const set = page.getByRole('article', { name: 'La Petite Fête' })
  // Mini Going Bananas 700 + cap 50 + small bandana 350
  await expect(set.getByText('₹1,100').last()).toBeVisible()
  await set.getByRole('combobox', { name: 'Birthday bandana size' }).selectOption('medium-large')
  await expect(set.getByText('₹1,150').last()).toBeVisible()
  await set.getByRole('button', { name: 'Add the set to your bag' }).click()
  const bag = page.getByRole('dialog', { name: 'Your bag' })
  await expect(bag.getByTestId('bag-lines').getByRole('listitem').filter({ has: page.getByRole('button', { name: /Remove/ }) })).toHaveCount(3)
})
