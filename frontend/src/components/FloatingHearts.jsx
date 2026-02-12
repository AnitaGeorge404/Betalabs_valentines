import { useMemo } from 'react'

/*
 * Slow-drift falling hearts — solid wine-red (#620725).
 * Uses pure CSS animations for performance. Low density, varying
 * sizes and opacities to create depth. No pink, no gradients.
 */

const HEART_COUNT = 14 // Low density – luxurious breathing room

function FloatingHearts() {
  const hearts = useMemo(() => {
    return Array.from({ length: HEART_COUNT }, (_, i) => {
      const size = 10 + Math.random() * 18            // 10-28 px
      const left = Math.random() * 100                 // random horizontal %
      const duration = 16 + Math.random() * 14         // 16-30s — slow drift
      const delay = Math.random() * duration * -1      // stagger starts
      const opacity = 0.12 + Math.random() * 0.28      // 12%-40% opacity for depth
      const sway = -30 + Math.random() * 60            // -30px to +30px lateral sway
      const startRot = -20 + Math.random() * 40        // slight tilt variation
      const isOutline = Math.random() > 0.55           // ~45% are outline hearts

      return { id: i, size, left, duration, delay, opacity, sway, startRot, isOutline }
    })
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="falling-heart"
          style={{
            left: `${h.left}%`,
            '--duration': `${h.duration}s`,
            '--delay': `${h.delay}s`,
            '--heart-opacity': h.opacity,
            '--sway': `${h.sway}px`,
            '--start-rot': `${h.startRot}deg`,
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill={h.isOutline ? 'none' : '#620725'}
            stroke={h.isOutline ? '#620725' : 'none'}
            strokeWidth={h.isOutline ? 1.5 : 0}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      ))}
    </div>
  )
}

export { FloatingHearts }
