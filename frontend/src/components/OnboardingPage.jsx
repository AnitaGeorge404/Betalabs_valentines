import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Trophy, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const onboardingSteps = [
  {
    title: "Welcome to Cupid's Ledger",
    description: "Discover your perfect match through our unique compatibility quiz and see who your campus crushes are!",
    icon: Heart
  },
  {
    title: "Answer Questions Honestly",
    description: "Rate your preferences from 0-10 to help us find the best matches for you.",
    icon: Star
  },
  {
    title: "Find Your Match",
    description: "Search through students, create matches, and climb the leaderboard!",
    icon: Trophy
  }
]

function OnboardingPage({ onComplete }) {
  const [step, setStep] = useState(0)
  const current = onboardingSteps[step]
  const StepIcon = current.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <motion.div
        key={step}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        className="bg-white rounded-[3rem] shadow-pink p-12 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <StepIcon
              strokeWidth={1.2}
              className="w-24 h-24 text-soft-red mx-auto mb-6"
            />
          </motion.div>
          <h2 className="font-serif text-4xl text-deep-crimson mb-4">
            {current.title}
          </h2>
          <p className="text-charcoal/70 font-sans text-lg max-w-md mx-auto">
            {current.description}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === step
                  ? 'bg-deep-crimson w-8'
                  : 'bg-pink-shadow/30'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          {step > 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(step - 1)}
              className="bg-white border-2 border-pink-shadow/30 rounded-full p-3 hover:border-soft-red transition-all"
            >
              <ChevronLeft strokeWidth={1.2} className="w-5 h-5 text-charcoal" />
            </motion.button>
          ) : (
            <div />
          )}

          {step < onboardingSteps.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(step + 1)}
              className="bg-deep-crimson rounded-full p-3 shadow-elegant"
            >
              <ChevronRight strokeWidth={1.2} className="w-5 h-5 text-white" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="bg-deep-crimson text-white rounded-2xl px-8 py-3 font-sans font-semibold shadow-elegant flex items-center gap-2"
            >
              Start Quiz
              <ArrowRight strokeWidth={1.2} className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export { OnboardingPage }
