import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Trophy, Search, User, Sparkles, Crown, Flame, 
  ChevronRight, ChevronLeft, Award, TrendingUp, Check, 
  Coffee, Music, Pizza, Book, Mountain, Palmtree, Home, 
  MessageCircle, Timer, Sunrise, Moon, Dog, Cat, Bird, X,
  Star, Zap, Eye, EyeOff, Medal, Mail, ArrowRight, Filter, Lock, Globe
} from 'lucide-react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('auth') // auth, onboarding, quiz, main
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [mainTab, setMainTab] = useState('match') // match, leaderboard, profile
  const [selectedPerson1, setSelectedPerson1] = useState(null)
  const [selectedPerson2, setSelectedPerson2] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [floatingHearts, setFloatingHearts] = useState([])

  // Generate continuous floating hearts
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

    // Initial hearts
    setFloatingHearts(Array.from({ length: 30 }, generateHeart))

    // Add new hearts periodically
    const interval = setInterval(() => {
      setFloatingHearts(prev => {
        if (prev.length < 40) return [...prev, generateHeart()]
        return prev
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Mock data
  const onboardingSteps = [
    {
      title: "Welcome to Cupid's Ledger",
      description: "Discover your perfect match through our unique compatibility quiz and see who your campus crushes are!",
      icon: Heart
    },
    {
      title: "Answer Questions Honestly",
      description: "Rate your preferences from 1-10 to help us find the best matches for you.",
      icon: Star
    },
    {
      title: "Find Your Match",
      description: "Search through students, create matches, and climb the leaderboard!",
      icon: Trophy
    }
  ]

  const quizQuestions = [
    { id: 1, question: "How important is good conversation to you?" },
    { id: 2, question: "Rate your preference for outdoor activities" },
    { id: 3, question: "How much do you value shared hobbies?" },
    { id: 4, question: "Rate the importance of physical attraction" },
    { id: 5, question: "How important is academic ambition?" },
    { id: 6, question: "Rate your preference for social events" },
    { id: 7, question: "How much do you value sense of humor?" },
    { id: 8, question: "Rate the importance of similar values" },
    { id: 9, question: "How important is emotional availability?" },
    { id: 10, question: "Rate your preference for long-term commitment" }
  ]

  const mockStudents = [
    "Emma Thompson", "Liam Chen", "Olivia Rodriguez", "Noah Williams",
    "Sophia Martinez", "Ethan Brown", "Ava Johnson", "Mason Davis",
    "Isabella Garcia", "Lucas Miller", "Mia Wilson", "Alexander Moore",
    "Charlotte Taylor", "James Anderson", "Amelia Thomas", "Benjamin Jackson"
  ].sort()

  const leaderboardData = [
    { rank: 1, name: "Emma Thompson", matches: 98, points: 2450 },
    { rank: 2, name: "Liam Chen", matches: 87, points: 2210 },
    { rank: 3, name: "Olivia Rodriguez", matches: 79, points: 1980 }
  ]

  const topCouples = [
    { person1: "Emma Thompson", person2: "Liam Chen", searches: 234 },
    { person1: "Sophia Martinez", person2: "Noah Williams", searches: 189 }
  ]

  // Auth Page
  const AuthPage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Animated Background Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: -50,
              opacity: 0
            }}
            animate={{
              y: window.innerHeight + 50,
              opacity: [0, 0.3, 0.3, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
          >
            <Heart 
              className="text-deep-crimson" 
              size={30 + i * 5} 
              fill="currentColor"
              opacity={0.1}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
        className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-pink hover:shadow-pink-lg transition-all duration-500 p-6 sm:p-8 md:p-12 max-w-md w-full relative z-10"
      >
        {/* Decorative Hearts */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block relative"
          >
            <Heart 
              strokeWidth={0} 
              fill="currentColor" 
              className="w-16 h-16 sm:w-20 sm:h-20 text-deep-crimson mx-auto mb-4 drop-shadow-lg" 
            />
            {/* Sparkle effects around heart */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ 
                scale: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-soft-red" fill="currentColor" />
            </motion.div>
            <motion.div
              className="absolute -bottom-2 -left-2"
              animate={{ 
                scale: [0, 1, 0],
                rotate: [360, 180, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-soft-red" fill="currentColor" />
            </motion.div>
          </motion.div>
          <h1 className="font-script text-4xl sm:text-5xl text-deep-crimson mb-3">
            Cupid's Ledger
          </h1>
          <p className="text-charcoal/70 font-sans text-sm">
            Find your perfect match on campus
          </p>
        </div>

        {/* Google Auth Button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -3, boxShadow: "0 20px 50px rgba(255, 182, 193, 0.4)" }}
          whileTap={{ scale: 0.97 }}
          animate={{
            boxShadow: [
              "0 10px 30px rgba(255, 182, 193, 0.15)",
              "0 15px 40px rgba(255, 182, 193, 0.25)",
              "0 10px 30px rgba(255, 182, 193, 0.15)"
            ]
          }}
          transition={{
            boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }}
          onClick={() => setCurrentPage('onboarding')}
          className="w-full bg-white border-2 border-pink-shadow/30 rounded-2xl p-4 flex items-center justify-center gap-3 hover:border-soft-red hover:shadow-elegant transition-all"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Mail strokeWidth={1.2} className="w-5 h-5 text-deep-crimson" />
          </motion.div>
          <span className="font-sans font-semibold text-charcoal">
            Continue with College Email
          </span>
        </motion.button>

        <p className="text-center text-xs text-charcoal/50 mt-6 font-sans">
          Only college email addresses are accepted
        </p>
      </motion.div>
    </motion.div>
  )

  // Onboarding Page
  const OnboardingPage = () => {
    const step = onboardingSteps[onboardingStep]
    const StepIcon = step.icon

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative"
        className="min-h-screen flex items-center justify-center p-6"
      >
        <motion.div
          key={onboardingStep}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="bg-white rounded-[3rem] shadow-pink p-12 max-w-2xl w-full"
        >
          {/* Icon */}
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
              {step.title}
            </h2>
            <p className="text-charcoal/70 font-sans text-lg max-w-md mx-auto">
              {step.description}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === onboardingStep 
                    ? 'bg-deep-crimson w-8' 
                    : 'bg-pink-shadow/30'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            {onboardingStep > 0 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOnboardingStep(onboardingStep - 1)}
                className="bg-white border-2 border-pink-shadow/30 rounded-full p-3 hover:border-soft-red transition-all"
              >
                <ChevronLeft strokeWidth={1.2} className="w-5 h-5 text-charcoal" />
              </motion.button>
            ) : (
              <div />
            )}

            {onboardingStep < onboardingSteps.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOnboardingStep(onboardingStep + 1)}
                className="bg-deep-crimson rounded-full p-3 shadow-elegant"
              >
                <ChevronRight strokeWidth={1.2} className="w-5 h-5 text-white" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('quiz')}
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

  // Quiz Page
  const QuizPage = () => {
    const question = quizQuestions[currentQuizQuestion]
    const currentAnswer = quizAnswers[question.id] || 5

    const handleRatingChange = (value) => {
      setQuizAnswers({ ...quizAnswers, [question.id]: value })
    }

    const handleNext = () => {
      if (currentQuizQuestion < quizQuestions.length - 1) {
        setCurrentQuizQuestion(currentQuizQuestion + 1)
      } else {
        setCurrentPage('main')
      }
    }

    const handlePrev = () => {
      if (currentQuizQuestion > 0) {
        setCurrentQuizQuestion(currentQuizQuestion - 1)
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
          key={currentQuizQuestion}
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
                Question {currentQuizQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="text-xs sm:text-sm font-sans font-semibold text-deep-crimson">
                {Math.round(((currentQuizQuestion + 1) / quizQuestions.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-pink-shadow/20 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` 
                }}
                className="h-full bg-gradient-to-r from-deep-crimson to-soft-red relative"
              >
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
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

            {/* Slider with Heart Thumb */}
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
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative"
              >
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentAnswer}
                  onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                  className="heart-slider w-full h-3 bg-gradient-to-r from-pink-shadow/30 via-pink-shadow/40 to-soft-red/50 rounded-full appearance-none cursor-pointer shadow-inner"
                />
              </motion.div>
              <div className="flex justify-between mt-4 px-2">
                <span className="text-sm font-sans font-semibold text-charcoal/60">1 - Low</span>
                <span className="text-sm font-sans font-semibold text-charcoal/60">10 - High</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-pink-shadow/10">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={currentQuizQuestion === 0}
              className="bg-white border-2 border-pink-shadow/30 rounded-full p-4 hover:border-soft-red hover:shadow-elegant transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <ChevronLeft strokeWidth={2} className="w-5 h-5 text-charcoal" />
            </motion.button>

            <div className="text-center">
              <p className="text-xs font-sans text-charcoal/50 mb-1">Question {currentQuizQuestion + 1} of {quizQuestions.length}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, x: 2, boxShadow: "0 10px 30px rgba(220, 20, 60, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="bg-deep-crimson text-white rounded-full px-8 py-4 font-sans font-semibold shadow-elegant flex items-center gap-2 hover:bg-soft-red transition-all"
            >
              {currentQuizQuestion < quizQuestions.length - 1 ? 'Next' : 'Finish'}
              <ChevronRight strokeWidth={2} className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Main App with Tabs
  const MainApp = () => {
    const filteredStudents = mockStudents.filter(student =>
      student.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Match Finder Tab
    const MatchFinder = () => (
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="bg-white rounded-3xl shadow-elegant p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search strokeWidth={1.2} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-pink-shadow/20 rounded-2xl font-sans focus:outline-none focus:border-soft-red transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border-2 border-pink-shadow/20 rounded-2xl p-3 hover:border-soft-red transition-all"
            >
              <Filter strokeWidth={1.2} className="w-5 h-5 text-charcoal" />
            </motion.button>
          </div>

          {/* Selected Persons */}
          {(selectedPerson1 || selectedPerson2) && (
            <div className="flex items-center gap-4 mb-4 p-4 bg-gradient-to-r from-deep-crimson/5 to-soft-red/5 rounded-2xl">
              {selectedPerson1 && (
                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-deep-crimson/10 flex items-center justify-center">
                    <User strokeWidth={1.2} size={16} className="text-deep-crimson" />
                  </div>
                  <span className="font-sans text-sm font-semibold text-charcoal">{selectedPerson1}</span>
                  <button onClick={() => setSelectedPerson1(null)}>
                    <X strokeWidth={1.2} size={16} className="text-charcoal/40 hover:text-charcoal" />
                  </button>
                </div>
              )}
              
              {selectedPerson1 && selectedPerson2 && (
                <Heart strokeWidth={1.2} fill="currentColor" className="w-5 h-5 text-soft-red" />
              )}
              
              {selectedPerson2 && (
                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-soft-red/10 flex items-center justify-center">
                    <User strokeWidth={1.2} size={16} className="text-soft-red" />
                  </div>
                  <span className="font-sans text-sm font-semibold text-charcoal">{selectedPerson2}</span>
                  <button onClick={() => setSelectedPerson2(null)}>
                    <X strokeWidth={1.2} size={16} className="text-charcoal/40 hover:text-charcoal" />
                  </button>
                </div>
              )}

              {selectedPerson1 && selectedPerson2 && (
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: "0 15px 40px rgba(220, 20, 60, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 10px 30px rgba(220, 20, 60, 0.3)",
                      "0 15px 40px rgba(220, 20, 60, 0.4)",
                      "0 10px 30px rgba(220, 20, 60, 0.3)"
                    ]
                  }}
                  transition={{
                    scale: { duration: 2, repeat: Infinity },
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                  onClick={() => {
                    // Match animation
                    setTimeout(() => {
                      setSelectedPerson1(null)
                      setSelectedPerson2(null)
                    }, 1000)
                  }}
                  className="ml-auto bg-deep-crimson text-white rounded-xl px-6 py-2 font-sans font-semibold shadow-elegant flex items-center gap-2"
                >
                  <Heart strokeWidth={1.2} fill="currentColor" className="w-4 h-4" />
                  Match!
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="bg-white rounded-3xl shadow-elegant p-4 sm:p-6">
          <h3 className="font-serif text-lg sm:text-xl text-deep-crimson mb-4">
            Select Students
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 max-h-96 overflow-y-auto pr-2">
            {filteredStudents.map((student, index) => (
              <motion.button
                key={student}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 15px 35px rgba(255, 182, 193, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!selectedPerson1) {
                    setSelectedPerson1(student)
                  } else if (!selectedPerson2 && student !== selectedPerson1) {
                    setSelectedPerson2(student)
                  }
                }}
                disabled={student === selectedPerson1 || student === selectedPerson2}
                className={`p-3 sm:p-4 rounded-2xl border-2 transition-all font-sans text-xs sm:text-sm relative overflow-hidden ${
                  student === selectedPerson1 || student === selectedPerson2
                    ? 'bg-gradient-to-br from-deep-crimson/10 to-soft-red/10 border-soft-red'
                    : 'border-pink-shadow/20 hover:border-soft-red bg-white'
                } disabled:cursor-not-allowed`}
              >
                {/* Sparkle effect on hover */}
                {(student === selectedPerson1 || student === selectedPerson2) && (
                  <motion.div
                    className="absolute top-1 right-1"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3 h-3 text-soft-red" fill="currentColor" />
                  </motion.div>
                )}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-shadow/20 mx-auto mb-2 flex items-center justify-center">
                  <User strokeWidth={1.2} size={16} className="text-charcoal sm:w-5 sm:h-5" />
                </div>
                <p className="text-charcoal font-semibold truncate text-xs sm:text-sm">{student}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Fun Message */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-deep-crimson/5 to-soft-red/5 rounded-3xl p-6 text-center relative overflow-hidden"
        >
          {/* Floating hearts in background */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ y: 100, opacity: 0 }}
                animate={{ 
                  y: -100, 
                  opacity: [0, 0.2, 0],
                  x: [0, 20, -20, 0]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 1.5
                }}
                style={{ left: `${20 + i * 30}%` }}
              >
                <Heart className="text-soft-red" size={20} fill="currentColor" opacity={0.2} />
              </motion.div>
            ))}
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles strokeWidth={1.2} className="w-6 h-6 sm:w-8 sm:h-8 text-soft-red mx-auto mb-3" />
          </motion.div>
          <p className="font-script text-xl sm:text-2xl text-deep-crimson mb-2">Boring day?</p>
          <p className="text-xs sm:text-sm text-charcoal/60 font-sans">Create some matches and spice things up!</p>
        </motion.div>
      </div>
    )

    // Leaderboard Tab
    const Leaderboard = () => (
      <div className="space-y-6">
        {/* Top Match Finders */}
        <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <Trophy strokeWidth={1.2} className="w-10 h-10 sm:w-12 sm:h-12 text-deep-crimson mx-auto mb-3" />
            </motion.div>
            <h3 className="font-serif text-2xl sm:text-3xl text-deep-crimson mb-2">Best Match Finders</h3>
            <p className="text-charcoal/60 font-sans text-xs sm:text-sm">Top matchmakers on campus</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {leaderboardData.map((player, index) => {
              const borderColors = {
                1: 'border-rose-400',
                2: 'border-rose-300',
                3: 'border-pink-300'
              }
              const icons = {
                1: Crown,
                2: Award,
                3: Medal
              }
              const Icon = icons[player.rank]
              
              return (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 50px rgba(255, 182, 193, 0.4)"
                  }}
                  className={`bg-white rounded-2xl border-4 ${borderColors[player.rank]} p-6 text-center relative overflow-hidden`}
                >
                  {/* Animated crown for #1 */}
                  {player.rank === 1 && (
                    <motion.div
                      className="absolute top-2 right-2"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 text-rose-400" fill="currentColor" />
                    </motion.div>
                  )}
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-crimson to-soft-red mx-auto mb-4 flex items-center justify-center"
                    animate={player.rank === 1 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </motion.div>
                  <h4 className="font-script text-lg sm:text-xl text-deep-crimson mb-4">{player.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-charcoal/60 font-sans text-xs sm:text-sm">Points</span>
                      <span className="text-charcoal font-bold text-sm sm:text-base">{player.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal/60 font-sans text-xs sm:text-sm">Matches</span>
                      <span className="text-charcoal font-bold text-sm sm:text-base">{player.matches}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Most Matched Couples */}
        <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <Flame strokeWidth={1.2} className="w-10 h-10 sm:w-12 sm:h-12 text-soft-red mx-auto mb-3" />
            </motion.div>
            <h3 className="font-serif text-2xl sm:text-3xl text-deep-crimson mb-2">Most Matched Couples</h3>
            <p className="text-charcoal/60 font-sans text-xs sm:text-sm">Couples matched by majority</p>
          </div>

          <div className="space-y-4">
            {topCouples.map((couple, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  x: 5,
                  boxShadow: "0 15px 40px rgba(255, 182, 193, 0.3)"
                }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-deep-crimson/5 to-soft-red/5 rounded-2xl p-6 flex items-center gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-deep-crimson/10 flex items-center justify-center">
                    <User strokeWidth={1.2} size={20} className="text-deep-crimson" />
                  </div>
                  <span className="font-serif text-lg text-charcoal">{couple.person1}</span>
                </div>

                <Heart strokeWidth={1.2} fill="currentColor" className="w-6 h-6 text-soft-red flex-shrink-0" />

                <div className="flex items-center gap-4 flex-1 justify-end">
                  <span className="font-serif text-lg text-charcoal">{couple.person2}</span>
                  <div className="w-12 h-12 rounded-full bg-soft-red/10 flex items-center justify-center">
                    <User strokeWidth={1.2} size={20} className="text-soft-red" />
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <div className="flex items-center gap-1 text-charcoal/60">
                    <TrendingUp strokeWidth={1.2} className="w-4 h-4" />
                    <span className="font-sans text-sm font-semibold">{couple.searches}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )

    // Profile Tab
    const Profile = () => (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-elegant p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-deep-crimson to-soft-red mx-auto mb-4 flex items-center justify-center">
              <User strokeWidth={1.2} size={40} className="text-white" />
            </div>
            <h2 className="font-script text-4xl text-deep-crimson mb-2">Emma Thompson</h2>
            <p className="text-charcoal/60 font-sans">emma.thompson@college.edu</p>
          </div>

          {/* Best Match Notification */}
          <div className="bg-gradient-to-r from-deep-crimson/5 to-soft-red/5 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-deep-crimson/10 flex items-center justify-center flex-shrink-0">
                <Heart strokeWidth={1.2} fill="currentColor" className="w-6 h-6 text-soft-red" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-lg text-deep-crimson mb-2">Your Best Match</h4>
                <p className="text-charcoal/70 font-sans text-sm mb-4">
                  Your perfect match will be revealed at 11:00 PM today. Get ready for something special!
                </p>
                <div className="flex items-center gap-2 text-charcoal/60">
                  <Timer strokeWidth={1.2} className="w-4 h-4" />
                  <span className="font-sans text-sm">Available in 6 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="border-t border-pink-shadow/20 pt-6">
            <h4 className="font-serif text-xl text-deep-crimson mb-4">Privacy Settings</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-semibold text-charcoal mb-1">Profile Visibility</p>
                <p className="text-sm text-charcoal/60 font-sans">
                  Let others see your best match
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPublic(true)}
                  className={`px-6 py-2 rounded-xl font-sans font-semibold transition-all ${
                    isPublic
                      ? 'bg-deep-crimson text-white shadow-elegant'
                      : 'bg-white border-2 border-pink-shadow/20 text-charcoal'
                  }`}
                >
                  <Globe strokeWidth={1.2} className="w-4 h-4 inline mr-2" />
                  Public
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPublic(false)}
                  className={`px-6 py-2 rounded-xl font-sans font-semibold transition-all ${
                    !isPublic
                      ? 'bg-deep-crimson text-white shadow-elegant'
                      : 'bg-white border-2 border-pink-shadow/20 text-charcoal'
                  }`}
                >
                  <Lock strokeWidth={1.2} className="w-4 h-4 inline mr-2" />
                  Private
                </motion.button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-pink-shadow/20 pt-6 mt-6">
            <h4 className="font-serif text-xl text-deep-crimson mb-4">Your Stats</h4>
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <motion.div 
                className="text-center bg-gradient-to-br from-deep-crimson/5 to-soft-red/5 rounded-2xl p-4"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.p 
                  className="text-2xl sm:text-3xl font-bold text-deep-crimson font-serif"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  1,245
                </motion.p>
                <p className="text-xs sm:text-sm text-charcoal/60 mt-1 font-sans">Points</p>
              </motion.div>
              <motion.div 
                className="text-center bg-gradient-to-br from-deep-crimson/5 to-soft-red/5 rounded-2xl p-4"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.p 
                  className="text-2xl sm:text-3xl font-bold text-deep-crimson font-serif"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  50
                </motion.p>
                <p className="text-xs sm:text-sm text-charcoal/60 mt-1 font-sans">Matches</p>
              </motion.div>
              <motion.div 
                className="text-center bg-gradient-to-br from-deep-crimson/5 to-soft-red/5 rounded-2xl p-4"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.p 
                  className="text-2xl sm:text-3xl font-bold text-deep-crimson font-serif"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", delay: 0.4 }}
                >
                  #12
                </motion.p>
                <p className="text-xs sm:text-sm text-charcoal/60 mt-1 font-sans">Rank</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className="min-h-screen pb-20 sm:pb-24">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white shadow-sm sticky top-0 z-20 border-b border-pink-shadow/10 backdrop-blur-lg bg-white/95"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.15, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart strokeWidth={0} fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8 text-deep-crimson" />
                </motion.div>
                <h1 className="font-script text-2xl sm:text-3xl text-deep-crimson">Cupid's Ledger</h1>
              </div>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-deep-crimson to-soft-red flex items-center justify-center cursor-pointer shadow-elegant"
              >
                <User strokeWidth={1.2} size={18} className="text-white sm:w-5 sm:h-5" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {mainTab === 'match' && <MatchFinder key="match" />}
            {mainTab === 'leaderboard' && <Leaderboard key="leaderboard" />}
            {mainTab === 'profile' && <Profile key="profile" />}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-pink-shadow/20 shadow-elegant z-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-around py-3 sm:py-4">
              {[
                { id: 'match', icon: Search, label: 'Find Match' },
                { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
                { id: 'profile', icon: User, label: 'Profile' }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = mainTab === tab.id
                
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMainTab(tab.id)}
                    className="relative flex flex-col items-center gap-1 px-4 sm:px-6 py-2 rounded-2xl transition-all"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-deep-crimson rounded-2xl"
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                      />
                    )}
                    <motion.div
                      animate={isActive ? { 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                      className="relative z-10"
                    >
                      <Icon 
                        strokeWidth={1.2} 
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-white' : 'text-charcoal/60'}`} 
                      />
                    </motion.div>
                    <span className={`text-[10px] sm:text-xs font-sans font-semibold relative z-10 ${
                      isActive ? 'text-white' : 'text-charcoal/60'
                    }`}>
                      {tab.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-pink relative overflow-hidden">
      {/* Continuous Floating Hearts Background */}
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
        {/* Sparkle dust */}
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
      
      {/* Main Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentPage === 'auth' && <AuthPage key="auth" />}
          {currentPage === 'onboarding' && <OnboardingPage key="onboarding" />}
          {currentPage === 'quiz' && <QuizPage key="quiz" />}
          {currentPage === 'main' && <MainApp key="main" />}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App

