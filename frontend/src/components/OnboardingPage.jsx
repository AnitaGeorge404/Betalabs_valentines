import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { DoodleEnvelope, DoodleKey, DoodleCherub, DoodleDivider } from './Doodles'
import { ShimmerButton } from './RomanticEffects'
import { lightHaptic, mediumHaptic } from '../lib/haptics'
import { LottieAccent } from './LottieAccent'

const onboardingSteps = [
  {
    title: "Welcome to the Ledger",
    description: "A bespoke matchmaking journal for IIIT Kottayam. Answer honestly, match boldly, and let Cupid keep score.",
    Doodle: DoodleCherub,
    doodleSize: 90,
  },
  {
    title: "Unlock Compatibility",
    description: "Rate your preferences from 0-10 on curated questions. Your answers paint a portrait only your match can see.",
    Doodle: DoodleKey,
    doodleSize: 70,
  },
  {
    title: "Write Your Entry",
    description: "Search students, create matches, and climb the leaderboard. Every entry in the ledger tells a story.",
    Doodle: DoodleEnvelope,
    doodleSize: 70,
  },
]

function OnboardingPage({ onComplete }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const current = onboardingSteps[step]
  const DoodleIcon = current.Doodle

  const goNext = () => { lightHaptic(); setDir(1); setStep(s => s + 1) }
  const goPrev = () => { lightHaptic(); setDir(-1); setStep(s => s - 1) }

  const variants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <LottieAccent
        className="absolute top-6 right-6"
        size={82}
        opacity={0.56}
        entranceDelay={0.15}
        floatDistance={12}
        floatDuration={6}
        driftX={5}
        rotateRange={5}
      />

      <div className="card-elevated px-8 sm:px-12 py-10 sm:py-14 max-w-xl w-full relative overflow-hidden">
        {/* Subtle corner decoration */}
        <div className="absolute top-4 right-4 opacity-[0.06]">
          <DoodleCherub size={100} />
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="text-center"
          >
            {/* Doodle illustration */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-6"
            >
              <DoodleIcon size={current.doodleSize} className="mx-auto opacity-60" />
            </motion.div>

            <h2 className="font-serif text-3xl sm:text-4xl text-wine mb-3 leading-tight">
              {current.title}
            </h2>

            <DoodleDivider className="max-w-[160px] mx-auto mb-4" />

            <p className="text-ink/55 font-sans text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mt-8 mb-8">
          {onboardingSteps.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                width: index === step ? 28 : 8,
                backgroundColor: index === step ? '#620725' : 'rgba(98,7,37,0.15)',
              }}
              className="h-2 rounded-full"
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {step > 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goPrev}
              className="btn-outline rounded-full p-3"
            >
              <ChevronLeft strokeWidth={1.5} className="w-5 h-5" />
            </motion.button>
          ) : (
            <div className="w-11" />
          )}

          {step < onboardingSteps.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goNext}
              className="btn-wine rounded-full p-3"
            >
              <ChevronRight strokeWidth={1.5} className="w-5 h-5 text-cream" />
            </motion.button>
          ) : (
            <ShimmerButton
              onClick={() => { mediumHaptic(); onComplete(); }}
              className="btn-wine rounded-xl px-7 py-3 font-sans font-semibold text-sm flex items-center gap-2 tracking-wide"
            >
              Begin Quiz
              <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
            </ShimmerButton>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export { OnboardingPage }
