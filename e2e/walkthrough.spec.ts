import { expect, test, type Page } from '@playwright/test'

const setClock = async (page: Page, hour: number, minute: number) => {
  const hourValue = page.getByTestId('hour-value')
  while ((await hourValue.getAttribute('data-value')) !== String(hour)) {
    await page.getByTestId('hour-inc').click()
  }
  const minuteValue = page.getByTestId('minute-value')
  while ((await minuteValue.getAttribute('data-value')) !== String(minute)) {
    await page.getByTestId('minute-inc').click()
  }
}

const dialTo = async (page: Page, target: number) => {
  const value = page.getByTestId('dial-value')
  while ((await value.textContent())?.trim() !== String(target)) {
    await page.getByTestId('dial-right').click()
  }
  await page.getByTestId('dial-confirm').click()
}

test.describe('Manor Escape', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('start').click()
    await expect(page.getByTestId('room-foyer')).toBeVisible()
  })

  test('rejects wrong answers and charges for hints', async ({ page }) => {
    await page.getByTestId('hotspot-foyer-clock').click()
    await page.getByTestId('clock-submit').click()
    await expect(page.getByTestId('puzzle-failed')).toBeVisible()

    await expect(page.getByTestId('hints-left')).toContainText('3')
    await page.getByTestId('use-hint').click()
    await expect(page.getByTestId('hints-left')).toContainText('2')
    await expect(page.getByTestId('timer')).not.toHaveText('30:00')
  })

  test('locked doors stay locked', async ({ page }) => {
    await page.getByTestId('hotspot-foyer-library-door').click()
    await expect(page.getByTestId('room-foyer')).toBeVisible()
    await expect(page.getByRole('status')).toContainText('Trancada')
  })

  test('full escape', async ({ page }) => {
    test.setTimeout(90_000)
    // Saguão
    await page.getByTestId('hotspot-foyer-vase').click()
    await expect(page.getByTestId('item-crumpled-note')).toBeVisible()

    await page.getByTestId('hotspot-foyer-clock').click()
    await setClock(page, 9, 15)
    await page.getByTestId('clock-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()
    await expect(page.getByTestId('item-bronze-key')).toBeVisible()

    await page.getByTestId('hotspot-foyer-library-door').click()
    await expect(page.getByTestId('room-library')).toBeVisible()

    // Biblioteca
    await page.getByTestId('hotspot-library-bookshelf').click()
    // Initial order: 1879, 1861, 1886, 1874, 1868 → target ascending.
    await page.getByTestId('book-vol-1861-left').click()
    await page.getByTestId('book-vol-1868-left').click()
    await page.getByTestId('book-vol-1868-left').click()
    await page.getByTestId('book-vol-1868-left').click()
    await page.getByTestId('book-vol-1874-left').click()
    await page.getByTestId('book-vol-1874-left').click()
    await page.getByTestId('sequence-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()

    await page.getByTestId('hotspot-library-letter').click()
    await page.getByTestId('cipher-input').fill('globo')
    await page.getByTestId('cipher-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()

    await page.getByTestId('hotspot-library-globe').click()
    await expect(page.getByTestId('item-iron-key')).toBeVisible()
    await page.getByTestId('hotspot-library-study-door').click()
    await expect(page.getByTestId('room-study')).toBeVisible()

    // Escritório
    await page.getByTestId('hotspot-study-safe').click()
    await expect(page.getByTestId('safe-canvas')).toBeVisible()
    await dialTo(page, 9)
    await dialTo(page, 3)
    await dialTo(page, 5)
    await page.getByTestId('safe-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()

    await page.getByTestId('hotspot-study-exit-door').click()
    await expect(page.getByTestId('end-won')).toBeVisible()
  })

  test('survives a reload mid-game', async ({ page }) => {
    await page.getByTestId('hotspot-foyer-vase').click()
    await page.reload()
    await expect(page.getByTestId('room-foyer')).toBeVisible()
    await expect(page.getByTestId('item-crumpled-note')).toBeVisible()
  })
})
