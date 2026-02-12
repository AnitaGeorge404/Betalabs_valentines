import { motion } from 'framer-motion'

/**
 * Floating mini hearts that appear around elements on hover/interaction
 * For that extra romantic Pinterest vibe
 */
function FloatingMiniHearts({ count = 6, size = 12, className = '' }) {
  const hearts = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    x: (Math.random() - 0.5) * 60,
    rotate: (Math.random() - 0.5) * 90,
  }))

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1.2, 0.8],
            y: [0, -40, -70, -100],
            x: [0, heart.x * 0.5, heart.x, heart.x * 1.2],
            rotate: [0, heart.rotate * 0.5, heart.rotate, heart.rotate * 1.5],
          }}
          transition={{
            duration: 2,
            delay: heart.delay,
            ease: 'easeOut',
          }}
          className="absolute left-1/2 top-1/2"
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="#620725"
            opacity="0.6"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Romantic hover card wrapper that adds floating hearts and micro-interactions
 */
function RomanticCard({ children, className = '', showHearts = true, ...props }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`relative ${className}`}
      {...props}
    >
      {showHearts && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <FloatingMiniHearts />
        </motion.div>
      )}
      {children}
    </motion.div>
  )
}

/**
 * Shimmer effect for buttons and interactive elements
 */
function ShimmerButton({ children, className = '', onClick, ...props }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{
          x: '200%',
          transition: { duration: 0.6, ease: 'easeInOut' },
        }}
      />
      {children}
    </motion.button>
  )
}

/**
 * Stagger container for animating lists and grids
 */
const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.6,
    },
  },
}

/**
 * Pinterest-style masonry card entrance
 */
const masonryVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 0.8,
    },
  },
}

export {
  FloatingMiniHearts,
  RomanticCard,
  ShimmerButton,
  staggerVariants,
  staggerItemVariants,
  masonryVariants,
}
