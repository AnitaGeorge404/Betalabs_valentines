import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function FloatingHearts() {
  const [floatingHearts, setFloatingHearts] = useState([])

  useEffect(() => {
    const generateHeart = () => ({
      id: Math.random(),
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 7,
      size: 12 + Math.random() * 20,
      emoji: ['❤️', '💕', '💖', '💗', '💝', '💓', '💞'][Math.floor(Math.random() * 7)],
      opacity: 0.4 + Math.random() * 0.4
    })

    setFloatingHearts(Array.from({ length: 30 }, generateHeart))

    const interval = setInterval(() => {
      setFloatingHearts(prev => {
        if (prev.length < 40) return [...prev, generateHeart()]
        return prev
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {floatingHearts.map(heart => (
        <motion.div
          key={heart.id}
          className="absolute"
          initial={{
            left: `${heart.left}%`,
            bottom: -50,
            opacity: 0,
            rotate: 0
          }}
          animate={{
            y: typeof window !== 'undefined' ? -(window.innerHeight + 100) : -1000,
            opacity: [0, heart.opacity, heart.opacity, 0],
            rotate: [0, 180, 360],
            x: [0, 30, -30, 0]
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ fontSize: `${heart.size}px` }}
        >
          {heart.emoji}
        </motion.div>
      ))}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          initial={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            scale: 0
          }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2
          }}
        >
          <Sparkles className="text-soft-red" size={10 + Math.random() * 8} />
        </motion.div>
      ))}
    </div>
  )
}

export { FloatingHearts }
