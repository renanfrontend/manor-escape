import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const TAU = Math.PI * 2

interface SafeDialProps {
  readonly steps: number
  /** Index currently under the marker (0..steps-1). */
  readonly value: number
  readonly onChange: (value: number) => void
}

const DIAL_X = -0.4
const wrapIndex = (index: number, steps: number) => ((index % steps) + steps) % steps

/** Draws the numbered face of the dial once into a texture (no font fetching, no extra assets). */
const useDialTexture = (steps: number) =>
  useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const cx = size / 2
    const gradient = ctx.createRadialGradient(cx, cx, 40, cx, cx, cx)
    gradient.addColorStop(0, '#3b3b40')
    gradient.addColorStop(1, '#151517')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = '#c9a24f'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(cx, cx, cx - 12, 0, TAU)
    ctx.stroke()
    ctx.fillStyle = '#f3e9d2'
    ctx.font = 'bold 64px "Cormorant Garamond", Georgia, serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let i = 0; i < steps; i += 1) {
      const angle = Math.PI / 2 - (i / steps) * TAU
      const radius = cx - 80
      ctx.fillText(String(i), cx + Math.cos(angle) * radius, cx - Math.sin(angle) * radius)
      // tick marks
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(angle) * (cx - 30), cx - Math.sin(angle) * (cx - 30))
      ctx.lineTo(cx + Math.cos(angle) * (cx - 16), cx - Math.sin(angle) * (cx - 16))
      ctx.strokeStyle = '#e3c27a'
      ctx.lineWidth = 4
      ctx.stroke()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [steps])

const Dial = ({ steps, value, onChange }: SafeDialProps) => {
  const group = useRef<THREE.Group>(null)
  const texture = useDialTexture(steps)
  const [dragging, setDragging] = useState(false)
  const dragState = useRef<{ startAngle: number; startRotation: number; rotation: number } | null>(null)
  const displayed = useRef(0)

  const step = TAU / steps
  const target = value * step

  useFrame((_, delta) => {
    if (!group.current) return
    if (dragging && dragState.current) {
      group.current.rotation.z = dragState.current.rotation
      displayed.current = dragState.current.rotation
      return
    }
    // shortest-path easing toward the target index
    let diff = target - displayed.current
    diff = ((diff + Math.PI) % TAU) - Math.PI
    if (diff < -Math.PI) diff += TAU
    displayed.current += diff * Math.min(1, delta * 10)
    group.current.rotation.z = displayed.current
  })

  const pointerAngle = (event: ThreeEvent<PointerEvent>) => Math.atan2(event.point.y, event.point.x - DIAL_X)

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    ;(event.target as Element).setPointerCapture?.(event.pointerId)
    dragState.current = { startAngle: pointerAngle(event), startRotation: displayed.current, rotation: displayed.current }
    setDragging(true)
  }
  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging || !dragState.current) return
    const { startAngle, startRotation } = dragState.current
    dragState.current.rotation = startRotation + (pointerAngle(event) - startAngle)
  }
  const onPointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (!dragState.current) return
    ;(event.target as Element).releasePointerCapture?.(event.pointerId)
    const snapped = wrapIndex(Math.round(dragState.current.rotation / step), steps)
    displayed.current = dragState.current.rotation
    dragState.current = null
    setDragging(false)
    onChange(snapped)
  }

  return (
    <group>
      {/* safe body */}
      <mesh position={[0, 0, -0.6]} receiveShadow castShadow>
        <boxGeometry args={[4.2, 4.2, 1.2]} />
        <meshStandardMaterial color="#2a2a30" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[3.6, 3.6, 0.1]} />
        <meshStandardMaterial color="#1c1c21" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* handle */}
      <mesh position={[1.35, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#c9a24f" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[1.35, 0, 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 1, 16]} />
        <meshStandardMaterial color="#c9a24f" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* marker */}
      <mesh position={[DIAL_X, 1.55, 0.36]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.12, 0.3, 4]} />
        <meshStandardMaterial color="#7a1f2b" emissive="#7a1f2b" emissiveIntensity={0.6} />
      </mesh>
      {/* dial */}
      <group
        ref={group}
        position={[DIAL_X, 0, 0.3]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.25, 1.3, 0.3, 48]} />
          <meshStandardMaterial color="#8f6d2a" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.16]}>
          <circleGeometry args={[1.2, 64]} />
          {texture ? (
            <meshStandardMaterial map={texture} metalness={0.2} roughness={0.7} />
          ) : (
            <meshStandardMaterial color="#222" />
          )}
        </mesh>
      </group>
    </group>
  )
}

export const SafeDial = (props: SafeDialProps) => (
  <Canvas
    shadows
    camera={{ position: [0, 0.5, 5.2], fov: 40 }}
    dpr={[1, 1.75]}
    style={{ touchAction: 'none' }}
    aria-hidden="true"
  >
    <color attach="background" args={['#120b0c']} />
    <ambientLight intensity={1.1} />
    <spotLight position={[3, 5, 6]} angle={0.5} penumbra={0.6} intensity={140} castShadow color="#ffd9a0" />
    <pointLight position={[-4, -2, 4]} intensity={8} color="#7a1f2b" />
    <Dial {...props} />
  </Canvas>
)
