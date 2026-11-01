import { test, expect } from '@playwright/test'

test.describe('SEO & Routing E2E Tests', () => {
  test('robots.txt is accessible and contains sitemap', async ({ page }) => {
    const res = await page.goto('/robots.txt')
    expect(res?.status()).toBe(200)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).toContain('Sitemap:')
  })

  test('sitemap.xml is accessible and valid XML', async ({ page }) => {
    const res = await page.goto('/sitemap.xml')
    expect(res?.status()).toBe(200)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).toContain('<?xml')
  })

  test('llms.txt is accessible', async ({ page }) => {
    const res = await page.goto('/llms.txt')
    expect(res?.status()).toBe(200)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).toContain('JaeTravel')
  })

  test('English URL without /en prefix loads homepage correctly', async ({ page }) => {
    const res = await page.goto('/')
    expect(res?.status()).toBe(200)
    await expect(page).toHaveTitle(/JaeTravel/)
  })

  test('Markdown alternate route returns markdown content', async ({ page }) => {
    const res = await page.goto('/tours.md')
    expect(res?.status()).toBe(200)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).toContain('#')
  })
})
