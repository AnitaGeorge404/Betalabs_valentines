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
      className="min-h-screen flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[3rem] shadow-pink p-12 max-w-md w-full"
      >
        {/* Decorative Hearts */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <Heart 
              strokeWidth={1.2} 
              fill="currentColor" 
              className="w-20 h-20 text-deep-crimson mx-auto mb-4" 
            />
          </motion.div>
          <h1 className="font-script text-5xl text-deep-crimson mb-3">
            Cupid's Ledger
          </h1>
          <p className="text-charcoal/70 font-sans text-sm">
            Find your perfect match on campus
          </p>
        </div>

        {/* Google Auth Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentPage('onboarding')}
          className="w-full bg-white border-2 border-pink-shadow/30 rounded-2xl p-4 flex items-center justify-center gap-3 hover:border-soft-red hover:shadow-elegant transition-all"
        >
          <Mail strokeWidth={1.2} className="w-5 h-5 text-deep-crimson" />
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
        className="min-h-screen flex items-center justify-center p-6"
      >
        <motion.div
          key={currentQuizQuestion}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-[3rem] shadow-pink p-12 max-w-3xl w-full"
        >
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-sans text-charcoal/60">
                Question {currentQuizQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm font-sans font-semibold text-deep-crimson">
                {Math.round(((currentQuizQuestion + 1) / quizQuestions.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-pink-shadow/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` 
                }}
                className="h-full bg-gradient-to-r from-deep-crimson to-soft-red"
              />
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-deep-crimson mb-8">
              {question.question}
            </h2>

            {/* Rating Display */}
            <div className="mb-8">
              <motion.div
                key={currentAnswer}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-deep-crimson/10 to-soft-red/10 rounded-3xl px-8 py-4"
              >
                {[...Array(currentAnswer)].map((_, i) => (
                  <Heart
                    key={i}
                    strokeWidth={1.2}
                    fill="currentColor"
                    className="w-6 h-6 text-soft-red"
                  />
                ))}
                <span className="font-serif text-4xl font-bold text-deep-crimson ml-2">
                  {currentAnswer}
                </span>
              </motion.div>
              <p className="text-sm text-charcoal/60 font-sans mt-4">
                Rate out of 10
              </p>
            </div>

            {/* Slider */}
            <div className="max-w-md mx-auto">
              <input
                type="range"
                min="1"
                max="10"
                value={currentAnswer}
                onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                className="w-full h-2 bg-pink-shadow/20 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-6 
                  [&::-webkit-slider-thumb]:h-6 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-deep-crimson
                  [&::-webkit-slider-thumb]:shadow-elegant
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-6 
                  [&::-moz-range-thumb]:h-6 
                  [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-deep-crimson
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:shadow-elegant
                  [&::-moz-range-thumb]:cursor-pointer"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs font-sans text-charcoal/50">1</span>
                <span className="text-xs font-sans text-charcoal/50">10</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={currentQuizQuestion === 0}
              className="bg-white border-2 border-pink-shadow/30 rounded-full p-3 hover:border-soft-red transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft strokeWidth={1.2} className="w-5 h-5 text-charcoal" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="bg-deep-crimson text-white rounded-2xl px-8 py-3 font-sans font-semibold shadow-elegant flex items-center gap-2"
            >
              {currentQuizQuestion < quizQuestions.length - 1 ? 'Next' : 'Finish'}
              <ChevronRight strokeWidth={1.2} className="w-5 h-5" />
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Match animation
                    setTimeout(() => {
                      setSelectedPerson1(null)
                      setSelectedPerson2(null)
                    }, 1000)
                  }}
                  className="ml-auto bg-deep-crimson text-white rounded-xl px-6 py-2 font-sans font-semibold shadow-elegant"
                >
                  Match!
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="bg-white rounded-3xl shadow-elegant p-6">
          <h3 className="font-serif text-xl text-deep-crimson mb-4">
            Select Students
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => (
              <motion.button
                key={student}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (!selectedPerson1) {
                    setSelectedPerson1(student)
                  } else if (!selectedPerson2 && student !== selectedPerson1) {
                    setSelectedPerson2(student)
                  }
                }}
                disabled={student === selectedPerson1 || student === selectedPerson2}
                className={`p-4 rounded-2xl border-2 transition-all font-sans text-sm ${
                  student === selectedPerson1 || student === selectedPerson2
                    ? 'bg-gradient-to-br from-deep-crimson/10 to-soft-red/10 border-soft-red'
                    : 'border-pink-shadow/20 hover:border-soft-red'
                } disabled:cursor-not-allowed`}
              >
                <div className="w-10 h-10 rounded-full bg-pink-shadow/20 mx-auto mb-2 flex items-center justify-center">
                  <User strokeWidth={1.2} size={18} className="text-charcoal" />
                </div>
                <p className="text-charcoal font-semibold truncate">{student}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Fun Message */}
        <div className="bg-gradient-to-r from-deep-crimson/5 to-soft-red/5 rounded-3xl p-6 text-center">
          <Sparkles strokeWidth={1.2} className="w-8 h-8 text-soft-red mx-auto mb-3" />
          <p className="font-script text-2xl text-deep-crimson mb-2">Boring day?</p>
          <p className="text-sm text-charcoal/60 font-sans">Create some matches and spice things up!</p>
        </div>
      </div>
    )

    // Leaderboard Tab
    const Leaderboard = () => (
      <div className="space-y-6">
        {/* Top Match Finders */}
        <div className="bg-white rounded-3xl shadow-elegant p-8">
          <div className="text-center mb-8">
            <Trophy strokeWidth={1.2} className="w-12 h-12 text-deep-crimson mx-auto mb-3" />
            <h3 className="font-serif text-3xl text-deep-crimson mb-2">Best Match Finders</h3>
            <p className="text-charcoal/60 font-sans text-sm">Top matchmakers on campus</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {leaderboardData.map((player) => {
              const borderColors = {
                1: 'border-rose-400',
                2: 'border-rose-300',
                3: 'border-pink-300'
              }
              
              return (
                <motion.div
                  key={player.rank}
                  whileHover={{ y: -4 }}
                  className={`bg-white rounded-2xl border-4 ${borderColors[player.rank]} p-6 text-center`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-crimson to-soft-red mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">#{player.rank}</span>
                  </div>
                  <h4 className="font-script text-xl text-deep-crimson mb-4">{player.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-charcoal/60 font-sans text-sm">Points</span>
                      <span className="text-charcoal font-bold">{player.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal/60 font-sans text-sm">Matches</span>
                      <span className="text-charcoal font-bold">{player.matches}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Most Matched Couples */}
        <div className="bg-white rounded-3xl shadow-elegant p-8">
          <div className="text-center mb-8">
            <Flame strokeWidth={1.2} className="w-12 h-12 text-soft-red mx-auto mb-3" />
            <h3 className="font-serif text-3xl text-deep-crimson mb-2">Most Matched Couples</h3>
            <p className="text-charcoal/60 font-sans text-sm">Couples matched by majority</p>
          </div>

          <div className="space-y-4">
            {topCouples.map((couple, index) => (
              <motion.div
                key={index}
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
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-deep-crimson font-serif">1,245</p>
                <p className="text-sm text-charcoal/60 mt-1 font-sans">Points</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-deep-crimson font-serif">50</p>
                <p className="text-sm text-charcoal/60 mt-1 font-sans">Matches</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-deep-crimson font-serif">#12</p>
                <p className="text-sm text-charcoal/60 mt-1 font-sans">Rank</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className="min-h-screen pb-24">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10 border-b border-pink-shadow/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart strokeWidth={1.2} fill="currentColor" className="w-8 h-8 text-deep-crimson" />
                <h1 className="font-script text-3xl text-deep-crimson">Cupid's Ledger</h1>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-crimson to-soft-red flex items-center justify-center cursor-pointer">
                <User strokeWidth={1.2} size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {mainTab === 'match' && <MatchFinder key="match" />}
            {mainTab === 'leaderboard' && <Leaderboard key="leaderboard" />}
            {mainTab === 'profile' && <Profile key="profile" />}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-shadow/20 shadow-elegant">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-around py-4">
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMainTab(tab.id)}
                    className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all ${
                      isActive ? 'bg-deep-crimson' : ''
                    }`}
                  >
                    <Icon 
                      strokeWidth={1.2} 
                      className={`w-6 h-6 ${isActive ? 'text-white' : 'text-charcoal/60'}`} 
                    />
                    <span className={`text-xs font-sans font-semibold ${
                      isActive ? 'text-white' : 'text-charcoal/60'
                    }`}>
                      {tab.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentPage === 'auth' && <AuthPage key="auth" />}
        {currentPage === 'onboarding' && <OnboardingPage key="onboarding" />}
        {currentPage === 'quiz' && <QuizPage key="quiz" />}
        {currentPage === 'main' && <MainApp key="main" />}
      </AnimatePresence>
    </div>
  )
}

export default App

