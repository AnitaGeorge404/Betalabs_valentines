import Lottie from 'lottie-react'
import { motion } from 'framer-motion'
import enamoredHeart from '../assets/animations/Red cute enamored heart.json'
import birdPair from '../assets/animations/Bird pair love and flying sky.json'
import heartLoading from '../assets/animations/Heart Loading.json'
import flyingHeart from '../assets/animations/Flying heart.json'
import { romanticPulseLottie } from '../lib/romanticLottieData'

function LottieAccent({
  className = '',
  size = 120,
  opacity = 0.8,
  variant = 'enamored',
  loop = true,
  entranceDelay = 0,
  float = true,
  floatDistance = 8,
  floatDuration = 5,
  driftX = 0,
  rotateRange = 0,
}) {
  const animationDataByVariant = {
    enamored: enamoredHeart,
    pulse: romanticPulseLottie,
    birds: birdPair,
    loading: heartLoading,
    flying: flyingHeart,
  }
  const animationData = animationDataByVariant[variant] || enamoredHeart

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={float
        ? {
            opacity,
            scale: 1,
            y: [0, -floatDistance, 0],
            x: driftX ? [0, driftX, 0] : 0,
            rotate: rotateRange ? [0, rotateRange, 0] : 0,
          }
        : { opacity, scale: 1 }}
      transition={float
        ? {
            opacity: { duration: 0.5, delay: entranceDelay, ease: 'easeOut' },
            scale: { duration: 0.5, delay: entranceDelay, ease: 'easeOut' },
            y: { duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: entranceDelay },
            x: { duration: floatDuration + 0.8, repeat: Infinity, ease: 'easeInOut', delay: entranceDelay },
            rotate: { duration: floatDuration + 0.4, repeat: Infinity, ease: 'easeInOut', delay: entranceDelay },
          }
        : { duration: 0.6, delay: entranceDelay, ease: 'easeOut' }}
      className={`pointer-events-none drop-shadow-[0_10px_26px_rgba(141,16,56,0.18)] ${className}`}
      style={{ width: size, height: size }}
    >
      <Lottie animationData={animationData} loop={loop} autoplay />
    </motion.div>
  )
}

export { LottieAccent }
