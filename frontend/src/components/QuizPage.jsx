import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getQuestions, submitAnswers } from '../lib/api'

function QuizPage({ userEmail, onComplete }) {
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-deep-crimson font-serif text-2xl"
        >
          Loading questions...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-pink p-8 text-center max-w-md">
          <p className="text-red-500 font-sans mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-deep-crimson text-white rounded-xl px-6 py-2 font-sans"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (questions.length === 0) return null

  const question = questions[currentIdx]
  const currentAnswer = answers[String(question.qid)] ?? 5.0

  const handleRatingChange = (value) => {
    setAnswers({ ...answers, [String(question.qid)]: parseFloat(value) })
  }

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      setSubmitting(true)
      try {
        await submitAnswers(userEmail, answers)
        onComplete()
      } catch (err) {
        setError(err.message)
        setSubmitting(false)
      }
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        key={currentIdx}
        initial={{ x: 100, opacity: 0, scale: 0.95 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: -100, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", bounce: 0.3 }}
        className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-pink hover:shadow-pink-lg transition-all duration-500 p-6 sm:p-8 md:p-12 max-w-3xl w-full"
      >
        {/* Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs sm:text-sm font-sans text-charcoal/60">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="text-xs sm:text-sm font-sans font-semibold text-deep-crimson">
              {Math.round(((currentIdx + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-pink-shadow/20 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIdx + 1) / questions.length) * 100}%`
              }}
              className="h-full bg-gradient-to-r from-deep-crimson to-soft-red relative"
            >
              <motion.div
                className="absolute inset-0 bg-white/30"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-deep-crimson mb-6 leading-relaxed px-4">
              {question.question}
            </h2>
          </motion.div>

          <style>{`
            .heart-slider::-webkit-slider-thumb {
              appearance: none;
              width: 40px;
              height: 40px;
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23DC143C'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E");
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              cursor: pointer;
              filter: drop-shadow(0 4px 10px rgba(220, 20, 60, 0.5));
              transition: all 0.2s ease;
            }
            .heart-slider::-webkit-slider-thumb:hover {
              transform: scale(1.2) rotate(5deg);
              filter: drop-shadow(0 6px 15px rgba(220, 20, 60, 0.7));
            }
            .heart-slider::-webkit-slider-thumb:active {
              transform: scale(1.15) rotate(-5deg);
            }
            .heart-slider::-moz-range-thumb {
              width: 40px;
              height: 40px;
              border: none;
              background-color: transparent;
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23DC143C'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E");
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              cursor: pointer;
              filter: drop-shadow(0 4px 10px rgba(220, 20, 60, 0.5));
              transition: all 0.2s ease;
            }
            .heart-slider::-moz-range-thumb:hover {
              transform: scale(1.2) rotate(5deg);
              filter: drop-shadow(0 6px 15px rgba(220, 20, 60, 0.7));
            }
            .heart-slider::-webkit-slider-runnable-track {
              height: 12px;
              border-radius: 999px;
            }
            .heart-slider::-moz-range-track {
              height: 12px;
              border-radius: 999px;
            }
          `}</style>
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-deep-crimson font-serif">
                {currentAnswer.toFixed(1)}
              </span>
            </div>
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={currentAnswer}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="heart-slider w-full h-3 bg-gradient-to-r from-pink-shadow/30 via-pink-shadow/40 to-soft-red/50 rounded-full appearance-none cursor-pointer shadow-inner"
              />
            </motion.div>
            <div className="flex justify-between mt-4 px-2">
              <span className="text-sm font-sans font-semibold text-charcoal/60">0.0 - Low</span>
              <span className="text-sm font-sans font-semibold text-charcoal/60">10.0 - High</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-pink-shadow/10">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="bg-white border-2 border-pink-shadow/30 rounded-full p-4 hover:border-soft-red hover:shadow-elegant transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ChevronLeft strokeWidth={2} className="w-5 h-5 text-charcoal" />
          </motion.button>

          <div className="text-center">
            <p className="text-xs font-sans text-charcoal/50 mb-1">
              Question {currentIdx + 1} of {questions.length}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, x: 2, boxShadow: "0 10px 30px rgba(220, 20, 60, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={submitting}
            className="bg-deep-crimson text-white rounded-full px-8 py-4 font-sans font-semibold shadow-elegant flex items-center gap-2 hover:bg-soft-red transition-all disabled:opacity-50"
          >
            {submitting
              ? 'Saving...'
              : currentIdx < questions.length - 1
              ? 'Next'
              : 'Finish'}
            <ChevronRight strokeWidth={2} className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export { QuizPage }
