import Lottie from 'lottie-react'
import { motion } from 'framer-motion'
import { romanticPulseLottie } from '../lib/romanticLottieData'

function LottieAccent({ className = '', size = 120, opacity = 0.8 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <Lottie animationData={romanticPulseLottie} loop autoplay />
    </motion.div>
  )
}

export { LottieAccent }
