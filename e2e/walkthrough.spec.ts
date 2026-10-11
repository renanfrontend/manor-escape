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

  test('clock hands stay inside the dial when turned', async ({ page }) => {
    await page.getByTestId('hotspot-foyer-clock').click()
    await setClock(page, 2, 35)
    const dial = page.getByRole('img', { name: /Relógio marcando/ })
    const hands = dial.locator('line')
    await expect(hands).toHaveCount(2)
    // As molas do Framer Motion levam um instante para assentar.
    await expect
      .poll(async () => {
        const area = await dial.boundingBox()
        const boxes = await Promise.all([0, 1].map((i) => hands.nth(i).boundingBox()))
        if (!area || boxes.some((box) => !box)) return false
        return boxes.every(
          (box) =>
            box !== null &&
            box.x >= area.x - 1 &&
            box.y >= area.y - 1 &&
            box.x + box.width <= area.x + area.width + 1 &&
            box.y + box.height <= area.y + area.height + 1,
        )
      })
      .toBe(true)
  })

  test('rejects wrong answers and charges for hints', async ({ page }) => {
    await page.getByTestId('hotspot-foyer-clock').click()
    await page.getByTestId('clock-submit').click()
    await expect(page.getByTestId('puzzle-failed')).toBeVisible()

    await expect(page.getByTestId('hints-left')).toContainText('5')
    await page.getByTestId('use-hint').click()
    await expect(page.getByTestId('hints-left')).toContainText('4')
    await expect(page.getByTestId('timer')).not.toHaveText('45:00')
  })

  test('locked doors stay locked', async ({ page }) => {
    await page.getByTestId('hotspot-foyer-library-door').click()
    await expect(page.getByTestId('room-foyer')).toBeVisible()
    await expect(page.getByRole('status')).toContainText('Trancada')
  })

  test('full escape', async ({ page }) => {
    test.setTimeout(120_000)
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

    await page.getByTestId('hotspot-study-secret-door').click()
    await expect(page.getByTestId('room-atelier')).toBeVisible()

    // Ateliê: Da Vinci
    await page.getByTestId('hotspot-atelier-board').click()
    await expect(page.getByTestId('inspect-modal')).toContainText('24 palmas')
    await page.keyboard.press('Escape')
    await page.getByTestId('hotspot-atelier-vitruvian').click()
    await page.getByTestId('cipher-input').fill('96')
    await page.getByTestId('cipher-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()

    await page.getByTestId('hotspot-atelier-codex').click()
    await expect(page.getByTestId('cipher-text')).toHaveAttribute('data-mirrored', 'true')
    await page.getByTestId('mirror-toggle').click()
    await page.getByTestId('cipher-input').fill('clepsidra')
    await page.getByTestId('cipher-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()

    await page.getByTestId('hotspot-atelier-lanterns').click()
    for (const cell of [1, 3, 5, 6]) await page.getByTestId(`lantern-${cell}`).click()
    await page.getByTestId('lanterns-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()
    await page.getByTestId('hotspot-atelier-crypt-door').click()
    await expect(page.getByTestId('room-crypt')).toBeVisible()

    // Cripta: anagrama e criptex
    await page.getByTestId('hotspot-crypt-tomb').click()
    await page.getByTestId('cipher-input').fill('Eleanor')
    await page.getByTestId('cipher-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()

    await page.getByTestId('hotspot-crypt-cryptex').click()
    for (const [wheel, letter] of [...'LEGADO'].entries()) {
      const target = letter.charCodeAt(0) - 65
      for (let i = 0; i < target; i += 1) await page.getByTestId(`cryptex-up-${wheel}`).click()
    }
    await page.getByTestId('cryptex-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()
    await page.getByTestId('hotspot-crypt-stairs').click()
    await expect(page.getByTestId('room-observatory')).toBeVisible()

    // Observatório: o exit só abre depois do astrolábio
    await page.getByTestId('hotspot-observatory-exit-door').click()
    await expect(page.getByTestId('room-observatory')).toBeVisible()
    await page.getByTestId('hotspot-observatory-planets').click()
    // Ordem inicial: Marte, Júpiter, Mercúrio, Terra, Vênus.
    for (const [id, times] of [['mercury', 2], ['venus', 3], ['earth', 2]] as const) {
      for (let i = 0; i < times; i += 1) await page.getByTestId(`book-${id}-left`).click()
    }
    await page.getByTestId('sequence-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()
    await page.getByTestId('hotspot-observatory-astrolabe').click()
    await dialTo(page, 3)
    await dialTo(page, 4)
    await page.getByTestId('safe-submit').click()
    await expect(page.getByTestId('puzzle-solved')).toBeVisible()
    await page.getByTestId('puzzle-continue').click()
    await page.getByTestId('hotspot-observatory-exit-door').click()
    await expect(page.getByTestId('end-won')).toBeVisible()
  })

  test('survives a reload mid-game', async ({ page }) => {
    await page.getByTestId('hotspot-foyer-vase').click()
    await page.reload()
    await expect(page.getByTestId('room-foyer')).toBeVisible()
    await expect(page.getByTestId('item-crumpled-note')).toBeVisible()
  })
})
