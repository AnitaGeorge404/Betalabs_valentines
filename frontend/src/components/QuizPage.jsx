import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getQuestions, submitAnswers } from '../lib/api'
import { DoodleDivider } from './Doodles'

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function QuizPage({ userEmail, onComplete }) {
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [phase, setPhase] = useState('profile') // profile | quiz
  const [gender, setGender] = useState(null)
  const [preference, setPreference] = useState(null)
  const [direction, setDirection] = useState(1)

  const shuffledQuestions = useMemo(() => shuffleArray(questions), [questions])

  useEffect(() => {
    getQuestions()
      .then((data) => { setQuestions(data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="card-elevated p-8 text-center"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#620725" opacity="0.5" className="mx-auto mb-3">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p className="font-serif text-xl text-wine/70">Preparing your quiz…</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-elevated p-8 text-center max-w-md">
          <p className="text-wine font-sans text-sm mb-4 bg-wine/5 border border-wine/10 rounded-lg p-3">{error}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setError(null); window.location.reload() }}
            className="btn-wine rounded-xl px-6 py-2.5 font-sans text-sm"
          >
            Retry
          </motion.button>
        </div>
      </div>
    )
  }

  // --- PROFILE PHASE ---
  if (phase === 'profile') {
    const canProceed = gender && preference
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.3 }}
          className="card-elevated px-6 sm:px-10 py-8 sm:py-12 max-w-lg w-full"
        >
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl text-wine mb-2">Before we start…</h2>
            <DoodleDivider className="max-w-[140px] mx-auto mb-3" />
            <p className="text-ink/50 font-sans text-sm">A quick note for Cupid's records</p>
          </div>

          {/* Gender */}
          <div className="mb-7">
            <p className="font-sans font-semibold text-ink/70 text-xs tracking-wider uppercase text-center mb-3">I am</p>
            <div className="flex gap-3 justify-center">
              {[
                { value: 'male', label: 'Male', icon: '♂' },
                { value: 'female', label: 'Female', icon: '♀' },
              ].map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setGender(opt.value)}
                  className={`flex-1 max-w-[160px] py-4 rounded-organic font-sans font-semibold text-sm transition-all flex flex-col items-center gap-1.5 ${
                    gender === opt.value
                      ? 'bg-wine text-cream shadow-editorial'
                      : 'border border-wine/12 text-ink/60 hover:border-wine/25'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span>{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preference */}
          <div className="mb-9">
            <p className="font-sans font-semibold text-ink/70 text-xs tracking-wider uppercase text-center mb-3">
              I am interested in
            </p>
            <div className="flex gap-3 justify-center">
              {[
                { value: 'men', label: 'Men', icon: '♂' },
                { value: 'women', label: 'Women', icon: '♀' },
              ].map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPreference(opt.value)}
                  className={`flex-1 max-w-[160px] py-4 rounded-organic font-sans font-semibold text-sm transition-all flex flex-col items-center gap-1.5 ${
                    preference === opt.value
                      ? 'bg-wine text-cream shadow-editorial'
                      : 'border border-wine/12 text-ink/60 hover:border-wine/25'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span>{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={canProceed ? { scale: 1.02, y: -1 } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
            onClick={() => canProceed && setPhase('quiz')}
            disabled={!canProceed}
            className={`w-full py-4 rounded-xl font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              canProceed
                ? 'btn-wine cursor-pointer'
                : 'bg-parchment-dark/40 text-ink/25 cursor-not-allowed'
            }`}
          >
            Continue to Quiz
            <ChevronRight strokeWidth={2} className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  // --- QUIZ PHASE ---
  if (shuffledQuestions.length === 0) return null

  const question = shuffledQuestions[currentIdx]
  const currentAnswer = answers[String(question.qid)] ?? 5.0
  const fillPercent = (currentAnswer / 10) * 100
  const totalSteps = shuffledQuestions.length

  const handleRatingChange = (value) => {
    setAnswers({ ...answers, [String(question.qid)]: parseFloat(value) })
  }

  const handleNext = async () => {
    if (currentIdx < totalSteps - 1) {
      setDirection(1)
      setCurrentIdx(currentIdx + 1)
    } else {
      setSubmitting(true)
      try {
        await submitAnswers(userEmail, answers, gender, preference)
        onComplete()
      } catch (err) {
        setError(err.message)
        setSubmitting(false)
      }
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setDirection(-1)
      setCurrentIdx(currentIdx - 1)
    }
  }

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
    >
      <div className="card-elevated px-6 sm:px-10 py-8 sm:py-12 max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-sans text-ink/40 tracking-wider uppercase">
              Question {currentIdx + 1} of {totalSteps}
            </span>
            <span className="pill-wine text-[0.65rem]">
              {Math.round(((currentIdx + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-parchment-dark/30 overflow-hidden">
            <motion.div
              animate={{ width: `${((currentIdx + 1) / totalSteps) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="h-full rounded-full bg-wine"
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.qid}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="text-center mb-8"
          >
            <h2 className="font-serif text-2xl sm:text-3xl text-wine mb-10 leading-relaxed px-2">
              {question.question}
            </h2>

            <style>{`
              .quiz-slider {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 6px;
                border-radius: 999px;
                outline: none;
                cursor: pointer;
                transition: box-shadow 0.3s ease;
              }
              .quiz-slider:focus {
                box-shadow: 0 0 0 4px rgba(98, 7, 37, 0.1);
              }
              .quiz-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: #620725;
                border: 3px solid #F5EDE6;
                box-shadow: 0 2px 10px rgba(98, 7, 37, 0.3);
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }
              .quiz-slider::-webkit-slider-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 4px 16px rgba(98, 7, 37, 0.4);
              }
              .quiz-slider::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #620725;
                border: 3px solid #F5EDE6;
                box-shadow: 0 2px 10px rgba(98, 7, 37, 0.3);
                cursor: pointer;
              }
              .quiz-slider::-webkit-slider-runnable-track {
                height: 6px;
                border-radius: 999px;
              }
              .quiz-slider::-moz-range-track {
                height: 6px;
                border-radius: 999px;
                background: transparent;
              }
            `}</style>

            <div className="max-w-xl mx-auto px-2 sm:px-4">
              <motion.div
                key={currentAnswer}
                initial={{ scale: 0.92 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="text-center mb-5"
              >
                <span className="text-4xl font-bold text-wine font-serif">
                  {currentAnswer.toFixed(1)}
                </span>
              </motion.div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={currentAnswer}
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="quiz-slider"
                  style={{
                    background: `linear-gradient(to right, #620725 ${fillPercent}%, rgba(98,7,37,0.12) ${fillPercent}%)`
                  }}
                />
              </div>

              <div className="flex justify-between mt-3 px-0.5">
                <span className="text-[0.65rem] font-sans font-medium text-ink/30 tracking-wide uppercase">
                  Strongly Disagree
                </span>
                <span className="text-[0.65rem] font-sans font-medium text-ink/30 tracking-wide uppercase">
                  Strongly Agree
                </span>
              </div>

              <div className="flex justify-between mt-2 px-0.5">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div
                    key={n}
                    className={`w-1 h-1 rounded-full transition-colors duration-200 ${
                      n <= currentAnswer ? 'bg-wine/50' : 'bg-wine/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-wine/8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="btn-outline rounded-full p-3.5 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft strokeWidth={2} className="w-4 h-4" />
          </motion.button>

          <div className="flex gap-1">
            {shuffledQuestions.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIdx ? 'w-4 bg-wine' : i < currentIdx ? 'w-1.5 bg-wine/35' : 'w-1.5 bg-wine/10'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            disabled={submitting}
            className="btn-wine rounded-xl px-7 py-3.5 font-sans font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : currentIdx < totalSteps - 1 ? 'Next' : 'Finish'}
            <ChevronRight strokeWidth={2} className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export { QuizPage }
