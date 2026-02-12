/*
 * Hand-drawn doodle SVG decorations for corners and dividers.
 * "Doodle-core" style — red-lined illustrations referencing the
 * Valentine's reference assets: cherubs, wine glasses, bows, hearts, keys, envelopes.
 */

// ---- Corner Doodles (fixed decorative) ----

export function DoodleCherub({ className = '', size = 80 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Simplified cherub with bow */}
      <circle cx="50" cy="30" r="14" stroke="#620725" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 28c2-3 5-5 8-5" stroke="#620725" strokeWidth="1" strokeLinecap="round" />
      <path d="M56 28c2-3 5-5 8-5" stroke="#620725" strokeWidth="1" strokeLinecap="round" />
      {/* Wings */}
      <path d="M30 40c-12-4-18-2-20 4s4 10 12 8" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M70 40c12-4 18-2 20 4s-4 10-12 8" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Body */}
      <ellipse cx="50" cy="55" rx="12" ry="15" stroke="#620725" strokeWidth="1.2" fill="none" />
      {/* Bow */}
      <path d="M42 50l-8-12M42 50l-12 4M42 50l8-2" stroke="#620725" strokeWidth="1" strokeLinecap="round" />
      <line x1="34" y1="38" x2="28" y2="48" stroke="#620725" strokeWidth="0.8" />
      {/* Arrow */}
      <line x1="28" y1="48" x2="80" y2="60" stroke="#620725" strokeWidth="0.8" strokeDasharray="3 2" />
      <path d="M78 57l4 3-1 4" stroke="#620725" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function DoodleEnvelope({ className = '', size = 60 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="44" height="30" rx="3" stroke="#620725" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 16l22 18 22-18" stroke="#620725" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Heart seal */}
      <path d="M30 32c-1.5-2.5-5-3-5 0s5 5 5 5 5-2 5-5-3.5-2.5-5 0z" fill="#620725" opacity="0.3" />
      {/* Small lines for "love letter" feel */}
      <line x1="18" y1="38" x2="26" y2="38" stroke="#620725" strokeWidth="0.7" opacity="0.4" />
      <line x1="18" y1="41" x2="30" y2="41" stroke="#620725" strokeWidth="0.7" opacity="0.4" />
    </svg>
  )
}

export function DoodleWineGlasses({ className = '', size = 60 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left glass */}
      <path d="M15 10c0 0-4 12-2 18s6 8 8 8" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M25 10c0 0 4 12 2 18s-6 8-8 8" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="20" y1="36" x2="20" y2="48" stroke="#620725" strokeWidth="1.2" />
      <line x1="14" y1="48" x2="26" y2="48" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" />
      {/* Right glass */}
      <path d="M35 10c0 0-4 12-2 18s6 8 8 8" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M45 10c0 0 4 12 2 18s-6 8-8 8" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="40" y1="36" x2="40" y2="48" stroke="#620725" strokeWidth="1.2" />
      <line x1="34" y1="48" x2="46" y2="48" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" />
      {/* Clink sparkle */}
      <path d="M28 14l2-3M32 12l1-4M30 8l-1-3" stroke="#620725" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

export function DoodleKey({ className = '', size = 50 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="8" stroke="#620725" strokeWidth="1.3" />
      <circle cx="15" cy="15" r="4" stroke="#620725" strokeWidth="0.8" opacity="0.5" />
      <line x1="22" y1="18" x2="42" y2="38" stroke="#620725" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="42" y1="38" x2="38" y2="42" stroke="#620725" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="36" y1="32" x2="32" y2="36" stroke="#620725" strokeWidth="1.3" strokeLinecap="round" />
      {/* Heart on key head */}
      <path d="M15 12c-1-1.5-3-1.8-3 0s3 3 3 3 3-1.2 3-3-2-1.5-3 0z" fill="#620725" opacity="0.25" />
    </svg>
  )
}

export function DoodleLock({ className = '', size = 40 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="18" width="24" height="16" rx="3" stroke="#620725" strokeWidth="1.3" />
      <path d="M14 18V12a6 6 0 0 1 12 0v6" stroke="#620725" strokeWidth="1.3" strokeLinecap="round" />
      {/* Heart keyhole */}
      <path d="M20 24c-1-1.5-3-1.8-3 0s3 3.5 3 3.5 3-1.7 3-3.5-2-1.5-3 0z" fill="#620725" opacity="0.35" />
    </svg>
  )
}

export function DoodleBow({ className = '', size = 50 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 25c-4-6-14-10-14-4s10 4 14 4" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M25 25c4-6 14-10 14-4s-10 4-14 4" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="25" cy="25" r="3" fill="#620725" opacity="0.3" />
      <path d="M22 28c-2 6-3 14-1 16" stroke="#620725" strokeWidth="1" strokeLinecap="round" />
      <path d="M28 28c2 6 3 14 1 16" stroke="#620725" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

export function DoodleRose({ className = '', size = 50 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Petals */}
      <path d="M25 14c-3-4-8-6-8-2s5 6 8 6" stroke="#620725" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M25 14c3-4 8-6 8-2s-5 6-8 6" stroke="#620725" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M25 18c-4-2-10-1-8 3s8 3 8 3" stroke="#620725" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M25 18c4-2 10-1 8 3s-8 3-8 3" stroke="#620725" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="25" cy="18" r="3.5" fill="#620725" opacity="0.15" />
      {/* Stem */}
      <path d="M25 24c0 0-1 10-2 20s0 12 2 14" stroke="#620725" strokeWidth="1.2" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M24 34c-6 2-10 0-8-3s8-1 8 0" stroke="#620725" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M24 42c6 2 10 0 8-3s-8-1-8 0" stroke="#620725" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

// ---- Section Divider ----
export function DoodleDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-wine/15 to-transparent" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6c-1.5-2.5-5-3-5 0s5 6 5 6 5-3 5-6-3.5-2.5-5 0z" fill="#620725" opacity="0.2" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-wine/15 to-transparent" />
    </div>
  )
}

// ---- Corner decorator wrapper ----
export function DoodleCorners({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <DoodleBow className="absolute -top-3 -left-3 opacity-20 rotate-[-15deg]" size={40} />
      <DoodleRose className="absolute -top-2 -right-2 opacity-15 rotate-12" size={36} />
      <DoodleKey className="absolute -bottom-2 -left-2 opacity-15 rotate-[-25deg]" size={32} />
      <DoodleWineGlasses className="absolute -bottom-3 -right-3 opacity-15 rotate-6" size={38} />
      {children}
    </div>
  )
}
