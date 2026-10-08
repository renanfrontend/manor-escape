import { expect, test, type Locator } from '@playwright/test'

const ROOMS = [
  { id: 'foyer', name: 'Saguão' },
  { id: 'library', name: 'Biblioteca' },
  { id: 'study', name: 'Escritório' },
] as const

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 375, height: 812 },
] as const

type Box = NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>

const boxOf = async (locator: Locator): Promise<Box> => {
  const box = await locator.boundingBox()
  if (!box) throw new Error(`${locator} is not rendered`)
  return box
}

const intersects = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

for (const viewport of VIEWPORTS) {
  test(`hotspots never cover the room title or description at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    // Unlock every room in the saved run so the HUD can visit them without solving the puzzles.
    await page.addInitScript(() => {
      const key = 'manor-escape:game-snapshot'
      const saved = localStorage.getItem(key)
      if (!saved) return
      const snapshot = JSON.parse(saved)
      snapshot.context.unlockedRooms = ['foyer', 'library', 'study']
      localStorage.setItem(key, JSON.stringify(snapshot))
    })
    await page.goto('/')
    await page.getByTestId('start').click()
    await expect(page.getByTestId('room-foyer')).toBeVisible()
    await page.reload()

    for (const room of ROOMS) {
      await page.getByRole('navigation', { name: 'Cômodos' }).getByRole('button', { name: room.name }).click()
      const scene = page.getByTestId(`room-${room.id}`)
      await expect(scene).toBeVisible()

      const header = await boxOf(scene.getByTestId('room-header'))
      const hotspots = await scene.locator('[data-testid^="hotspot-"]').all()
      expect(hotspots.length).toBeGreaterThan(0)
      for (const hotspot of hotspots) {
        const id = await hotspot.getAttribute('data-testid')
        expect(intersects(await boxOf(hotspot), header), `${id} overlaps the ${room.name} header`).toBe(false)
      }
    }
  })
}
