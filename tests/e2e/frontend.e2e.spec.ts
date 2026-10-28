import { test, expect } from '@playwright/test'

// Run `pnpm seed` first so the sample content exists.
test.describe('Frontend', () => {
  test('home page shows the hero slider and the main menu', async ({ page }) => {
    await page.goto('http://localhost:3000/en')
    await expect(page.locator('h1').first()).toContainText('Kenya and East Africa')
    await expect(page.getByRole('navigation', { name: 'Main menu' })).toBeVisible()
    await expect(page.getByRole('group', { name: 'Featured safaris' })).toBeVisible()
  })

  test('tour tabs switch in place and the price follows the date', async ({ page }) => {
    await page.goto('http://localhost:3000/en/tours/masai-mara-classic-safari')
    const url = page.url().split('#')[0]
    await page.getByRole('tab', { name: 'Inclusions' }).click()
    await expect(page.getByRole('tabpanel', { name: 'Inclusions' })).toBeVisible()
    expect(page.url().split('#')[0]).toBe(url)
    await page.getByRole('tab', { name: 'Booking' }).click()
    await page.getByLabel('Country').selectOption('KE')
    await expect(page.getByLabel('WhatsApp or phone number')).toBeEnabled()
    await page.getByLabel('Number of travellers').selectOption('4')
    await page.getByLabel('Intended travel date').fill('2027-08-10')
    await expect(page.getByText('Peak season').first()).toBeVisible()
  })

  test('a tour opened under the wrong prefix redirects to its own', async ({ page }) => {
    await page.goto('http://localhost:3000/en/tours/accessible-masai-mara-safari')
    await expect(page).toHaveURL(/\/en\/disability-tours\/accessible-masai-mara-safari/)
  })
})
