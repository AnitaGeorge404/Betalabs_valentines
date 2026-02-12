import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Lottie from 'lottie-react'
import flyingHeart from '../assets/animations/Flying heart.json'

function FlyingHeartCursor() {
  const [visible, setVisible] = useState(false)
  const [hideNativeCursor, setHideNativeCursor] = useState(false)
  const hideTimerRef = useRef(null)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const smoothX = useSpring(mouseX, { stiffness: 260, damping: 30, mass: 0.55 })
  const smoothY = useSpring(mouseY, { stiffness: 260, damping: 30, mass: 0.55 })

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')

    const applyPointerMode = () => {
      const shouldHideNative = media.matches
      setHideNativeCursor(shouldHideNative)
      document.body.classList.toggle('heart-cursor-enabled', shouldHideNative)
    }

    applyPointerMode()
    media.addEventListener('change', applyPointerMode)

    return () => {
      media.removeEventListener('change', applyPointerMode)
      document.body.classList.remove('heart-cursor-enabled')
    }
  }, [])

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }

    const scheduleHide = (delay = 140) => {
      clearHideTimer()
      hideTimerRef.current = setTimeout(() => setVisible(false), delay)
    }

    const handlePointerMove = (event) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
      setVisible(true)
      if (event.pointerType === 'touch') scheduleHide(180)
      else clearHideTimer()
    }

    const handlePointerDown = (event) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
      setVisible(true)
    }

    const handlePointerUp = (event) => {
      if (event.pointerType === 'touch') scheduleHide(120)
    }

    const handlePointerCancel = () => scheduleHide(60)

    const handleWindowLeave = (event) => {
      if (!event.relatedTarget && !event.toElement) setVisible(false)
    }

    const handleBlur = () => setVisible(false)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    window.addEventListener('pointercancel', handlePointerCancel, { passive: true })
    window.addEventListener('mouseout', handleWindowLeave)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerCancel)
      window.removeEventListener('mouseout', handleWindowLeave)
      window.removeEventListener('blur', handleBlur)
      clearHideTimer()
    }
  }, [mouseX, mouseY])

  return (
    <motion.div
      style={{ x: smoothX, y: smoothY }}
      className="fixed top-0 left-0 z-[120] pointer-events-none"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.12 }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <div className={`opacity-95 drop-shadow-[0_8px_20px_rgba(141,16,56,0.35)] ${hideNativeCursor ? 'w-11 h-11' : 'w-10 h-10'}`}>
          <Lottie animationData={flyingHeart} loop autoplay />
        </div>
      </div>
    </motion.div>
  )
}

export { FlyingHeartCursor }
