import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { getQuestions, submitAnswers } from '../lib/api'

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
      .then((data) => {
        setQuestions(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neo-white">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="neo-card p-8 text-center"
        >
          <div className="neo-circle w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Heart strokeWidth={0} fill="currentColor" className="w-8 h-8 text-soft-red" />
          </div>
          <p className="text-soft-red font-serif text-2xl">Loading questions...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neo-white">
        <div className="neo-card p-8 text-center max-w-md">
          <p className="text-soft-red font-sans mb-4 neo-pressed p-3 rounded-xl">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, boxShadow: "var(--neo-inset-shadow)" }}
            onClick={() => { setError(null); window.location.reload() }}
            className="neo-btn-primary text-white rounded-xl px-6 py-2 font-sans"
          >
            Retry
          </motion.button>
        </div>
      </div>
    )
  }

  // --- PROFILE PHASE: Gender + Preference ---
  if (phase === 'profile') {
    const canProceed = gender && preference
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-neo-white"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.3 }}
          className="neo-card p-6 sm:p-8 md:p-12 max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <div className="neo-circle w-20 h-20 mx-auto flex items-center justify-center">
                <Heart strokeWidth={0} fill="currentColor" className="w-12 h-12 text-soft-red" />
              </div>
            </motion.div>
            <div className="neo-pressed py-3 px-6 mb-3 inline-block rounded-full">
              <h2 className="font-serif text-3xl sm:text-4xl text-soft-red">Before we start...</h2>
            </div>
            <div className="neo-flat py-2 px-4 inline-block rounded-full">
              <p className="text-charcoal/70 font-sans text-sm sm:text-base">Tell us a bit about yourself</p>
            </div>
          </div>

          {/* Gender */}
          <div className="mb-8">
            <div className="neo-pressed py-2 px-4 rounded-full mb-3 mx-auto w-fit">
              <p className="font-sans font-semibold text-charcoal text-sm text-center">I am</p>
            </div>
            <div className="flex gap-3 justify-center">
              {[
                { value: 'male', label: 'Male', icon: '♂' },
                { value: 'female', label: 'Female', icon: '♀' },
              ].map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95, boxShadow: "var(--neo-inset-shadow)" }}
                  onClick={() => setGender(opt.value)}
                  className={`flex-1 max-w-[180px] py-4 rounded-2xl font-sans font-semibold text-base transition-all flex flex-col items-center gap-1 ${
                    gender === opt.value
                      ? 'neo-btn-primary text-white'
                      : 'neo-btn text-charcoal/70'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span>{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preference */}
          <div className="mb-10">
            <div className="neo-pressed py-2 px-4 rounded-full mb-3 mx-auto w-fit">
              <p className="font-sans font-semibold text-charcoal text-sm text-center">I am interested in</p>
            </div>
            <div className="flex gap-3 justify-center">
              {[
                { value: 'men', label: 'Men', icon: '♂' },
                { value: 'women', label: 'Women', icon: '♀' },
              ].map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95, boxShadow: "var(--neo-inset-shadow)" }}
                  onClick={() => setPreference(opt.value)}
                  className={`flex-1 max-w-[180px] py-4 rounded-2xl font-sans font-semibold text-base transition-all flex flex-col items-center gap-1 ${
                    preference === opt.value
                      ? 'neo-btn-primary text-white'
                      : 'neo-btn text-charcoal/70'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span>{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={canProceed ? { scale: 1.03, y: -2 } : {}}
            whileTap={canProceed ? { scale: 0.97, boxShadow: "var(--neo-inset-shadow)" } : {}}
            onClick={() => canProceed && setPhase('quiz')}
            disabled={!canProceed}
            className={`w-full py-4 rounded-2xl font-sans font-bold text-base flex items-center justify-center gap-2 transition-all ${
              canProceed
                ? 'neo-btn-primary text-white cursor-pointer'
                : 'neo-pressed bg-gray-100 text-charcoal/30 cursor-not-allowed'
            }`}
          >
            Continue to Quiz
            <ChevronRight strokeWidth={2} className="w-5 h-5" />
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
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-neo-white"
    >
      <div className="neo-card p-6 sm:p-8 md:p-12 max-w-3xl w-full">
        {/* Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="neo-pressed py-1 px-3 rounded-full">
              <span className="text-xs sm:text-sm font-sans text-charcoal/70">
                Question {currentIdx + 1} of {totalSteps}
              </span>
            </div>
            <div className="neo-flat py-1 px-3 rounded-full">
              <span className="text-xs sm:text-sm font-sans font-semibold text-soft-red">
                {Math.round(((currentIdx + 1) / totalSteps) * 100)}%
              </span>
            </div>
          </div>
          <div className="neo-pressed h-3 rounded-full overflow-hidden relative">
            <motion.div
              animate={{ width: `${((currentIdx + 1) / totalSteps) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="h-full bg-gradient-to-r from-deep-crimson to-soft-red rounded-full relative"
            >
              <motion.div
                className="absolute inset-0 bg-white/25"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </div>

        {/* Question - animated swap */}
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
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-deep-crimson mb-10 leading-relaxed px-4">
              {question.question}
            </h2>

            <style>{`
              .quiz-slider {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 10px;
                border-radius: 999px;
                outline: none;
                cursor: pointer;
                transition: box-shadow 0.3s ease;
              }
              .quiz-slider:focus {
                box-shadow: 0 0 0 4px rgba(220, 20, 60, 0.15);
              }
              .quiz-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: linear-gradient(135deg, #DC143C, #FF6B81);
                border: 3px solid white;
                box-shadow: 0 4px 14px rgba(220, 20, 60, 0.45);
                cursor: pointer;
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
              }
              .quiz-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 6px 20px rgba(220, 20, 60, 0.6);
              }
              .quiz-slider::-webkit-slider-thumb:active {
                transform: scale(1.1);
                box-shadow: 0 3px 10px rgba(220, 20, 60, 0.5);
              }
              .quiz-slider::-moz-range-thumb {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: linear-gradient(135deg, #DC143C, #FF6B81);
                border: 3px solid white;
                box-shadow: 0 4px 14px rgba(220, 20, 60, 0.45);
                cursor: pointer;
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
              }
              .quiz-slider::-moz-range-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 6px 20px rgba(220, 20, 60, 0.6);
              }
              .quiz-slider::-webkit-slider-runnable-track {
                height: 10px;
                border-radius: 999px;
              }
              .quiz-slider::-moz-range-track {
                height: 10px;
                border-radius: 999px;
                background: transparent;
              }
            `}</style>

            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              {/* Score display */}
              <motion.div
                key={currentAnswer}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="text-center mb-5"
              >
                <span className="text-4xl font-bold text-deep-crimson font-serif">
                  {currentAnswer.toFixed(1)}
                </span>
              </motion.div>

              {/* Slider with gradient fill */}
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
                    background: `linear-gradient(to right, #DC143C ${fillPercent}%, #f3d5da ${fillPercent}%)`
                  }}
                />
              </div>

              {/* Labels */}
              <div className="flex justify-between mt-3 px-1">
                <span className="text-xs font-sans font-semibold text-charcoal/40">Strongly Disagree</span>
                <span className="text-xs font-sans font-semibold text-charcoal/40">Strongly Agree</span>
              </div>

              {/* Dot indicators */}
              <div className="flex justify-between mt-2 px-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div
                    key={n}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                      n <= currentAnswer ? 'bg-deep-crimson/60' : 'bg-pink-shadow/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-pink-shadow/10">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="bg-white border-2 border-pink-shadow/30 rounded-full p-4 hover:border-soft-red hover:shadow-elegant transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft strokeWidth={2} className="w-5 h-5 text-charcoal" />
          </motion.button>

          <div className="flex gap-1">
            {shuffledQuestions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIdx ? 'w-5 bg-deep-crimson' : i < currentIdx ? 'w-1.5 bg-deep-crimson/40' : 'w-1.5 bg-pink-shadow/30'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, x: 2, boxShadow: '0 10px 30px rgba(220, 20, 60, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={submitting}
            className="bg-deep-crimson text-white rounded-full px-8 py-4 font-sans font-semibold shadow-elegant flex items-center gap-2 hover:bg-soft-red transition-all disabled:opacity-50"
          >
            {submitting
              ? 'Saving...'
              : currentIdx < totalSteps - 1
              ? 'Next'
              : 'Finish'}
            <ChevronRight strokeWidth={2} className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export { QuizPage }
