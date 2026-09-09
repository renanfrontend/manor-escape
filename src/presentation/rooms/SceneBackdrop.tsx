import type { RoomId } from '@/domain'

interface Palette {
  readonly wall: string
  readonly wallDark: string
  readonly floor: string
  readonly accent: string
}

const PALETTES: Record<RoomId, Palette> = {
  foyer: { wall: '#3a1f24', wallDark: '#22121a', floor: '#2b1a12', accent: '#7a1f2b' },
  library: { wall: '#1f2a26', wallDark: '#121a17', floor: '#26170f', accent: '#5b6b3a' },
  study: { wall: '#2a2333', wallDark: '#17131f', floor: '#1e1512', accent: '#4a3a5c' },
}

/** Decorative SVG stage: damask wallpaper, wainscot, floorboards and a candle-lit vignette. */
export const SceneBackdrop = ({ room }: { readonly room: RoomId }) => {
  const palette = PALETTES[room]
  const patternId = `damask-${room}`
  const planksId = `planks-${room}`
  const vignetteId = `vignette-${room}`

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill={palette.wall} />
          <path
            d="M30 5c6 10 16 12 20 25-4 13-14 15-20 25-6-10-16-12-20-25 4-13 14-15 20-25z"
            fill="none"
            stroke={palette.accent}
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
          <circle cx="30" cy="30" r="2" fill={palette.accent} fillOpacity="0.4" />
        </pattern>
        <pattern id={planksId} width="140" height="40" patternUnits="userSpaceOnUse">
          <rect width="140" height="40" fill={palette.floor} />
          <rect x="0" y="0" width="140" height="1" fill="#000" fillOpacity="0.45" />
          <rect x="70" y="0" width="1" height="40" fill="#000" fillOpacity="0.35" />
        </pattern>
        <radialGradient id={vignetteId} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffd28a" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      <rect width="1000" height="420" fill={`url(#${patternId})`} />
      {/* crown moulding + wainscot */}
      <rect y="0" width="1000" height="14" fill={palette.wallDark} />
      <rect y="330" width="1000" height="90" fill={palette.wallDark} />
      <rect y="330" width="1000" height="4" fill={palette.accent} fillOpacity="0.5" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={i * 100 + 12} y="345" width="76" height="60" fill="none" stroke="#000" strokeOpacity="0.35" />
      ))}
      {/* floor */}
      <rect y="420" width="1000" height="180" fill={`url(#${planksId})`} />
      <rect y="418" width="1000" height="6" fill="#000" fillOpacity="0.5" />
      <rect width="1000" height="600" fill={`url(#${vignetteId})`} />
    </svg>
  )
}
