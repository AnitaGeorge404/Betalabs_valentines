import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Trophy, Search, User, Sparkles, Crown, Flame, 
  ChevronRight, ChevronLeft, Award, TrendingUp, Check, 
  Coffee, Music, Pizza, Book, Mountain, Palmtree, Home, 
  MessageCircle, Timer, Sunrise, Moon, Dog, Cat, Bird, X,
  Star, Zap, Eye, EyeOff, Medal
} from 'lucide-react'
import './App.css'

// Questionnaire Data with Lucide Icons
const questions = [
  {
    id: 1,
    question: "Pineapple on pizza: Dealbreaker or Love language?",
    icon: Pizza,
    options: [
      { text: "Absolute dealbreaker!", icon: X },
      { text: "Love language!", icon: Heart },
      { text: "I'm Switzerland", icon: Check }
    ]
  },
  {
    id: 2,
    question: "Are you an Early bird or Night owl?",
    icon: Sparkles,
    options: [
      { text: "Early bird", icon: Sunrise },
      { text: "Night owl", icon: Moon },
      { text: "Whenever the vibe hits", icon: Zap }
    ]
  },
  {
    id: 3,
    question: "First date: Library or Beach?",
    icon: Heart,
    options: [
      { text: "Library vibes", icon: Book },
      { text: "Beach vibes", icon: Palmtree },
      { text: "Coffee shop compromise", icon: Coffee }
    ]
  },
  {
    id: 4,
    question: "Your go-to Friday night?",
    icon: Star,
    options: [
      { text: "Party hard", icon: Music },
      { text: "Netflix & chill", icon: Home },
      { text: "Dinner with close friends", icon: Heart }
    ]
  },
  {
    id: 5,
    question: "Love language preference?",
    icon: Heart,
    options: [
      { text: "Words of affirmation", icon: MessageCircle },
      { text: "Physical touch", icon: Heart },
      { text: "Quality time", icon: Timer },
      { text: "Acts of service", icon: Star }
    ]
  },
  {
    id: 6,
    question: "Texting style?",
    icon: MessageCircle,
    options: [
      { text: "Essay writer", icon: Book },
      { text: "One-word wonder", icon: Zap },
      { text: "Heart emoji enthusiast", icon: Heart }
    ]
  },
  {
    id: 7,
    question: "Dream vacation?",
    icon: Sparkles,
    options: [
      { text: "Adventure sports", icon: Mountain },
      { text: "Cultural exploration", icon: Book },
      { text: "Beach resort", icon: Palmtree },
      { text: "Staycation", icon: Home }
    ]
  },
  {
    id: 8,
    question: "How do you handle conflicts?",
    icon: MessageCircle,
    options: [
      { text: "Talk it out immediately", icon: MessageCircle },
      { text: "Need space first", icon: Moon },
      { text: "Avoid at all costs", icon: X }
    ]
  },
  {
    id: 9,
    question: "Your ideal Saturday morning?",
    icon: Sunrise,
    options: [
      { text: "Sleep in till noon", icon: Moon },
      { text: "Early workout", icon: Zap },
      { text: "Brunch with friends", icon: Coffee }
    ]
  },
  {
    id: 10,
    question: "Pet preference?",
    icon: Heart,
    options: [
      { text: "Dog person", icon: Dog },
      { text: "Cat person", icon: Cat },
      { text: "All animals!", icon: Bird },
      { text: "No pets", icon: X }
    ]
  }
]

// Mock data
const students = [
  'Alex Johnson', 'Jamie Smith', 'Taylor Brown', 'Morgan Davis', 'Casey Wilson',
  'Riley Martinez', 'Jordan Anderson', 'Parker Thomas', 'Avery Jackson', 'Quinn White',
  'Cameron Harris', 'Sage Martin', 'Drew Thompson', 'Reese Garcia', 'Skylar Robinson',
  'Emerson Clark', 'Rowan Lewis', 'Finley Lee', 'Hayden Walker', 'Blake Hall'
]

const leaderboardData = [
  { rank: 1, name: 'Emma Thompson', avatar: '👑', points: 2450, matches: 98, successRate: 94, recentActivity: 'hot' },
  { rank: 2, name: 'Liam Chen', avatar: '✨', points: 2210, matches: 87, successRate: 89, recentActivity: 'hot' },
  { rank: 3, name: 'Olivia Rodriguez', avatar: '💫', points: 1980, matches: 79, successRate: 85, recentActivity: 'hot' },
  { rank: 4, name: 'Noah Williams', avatar: '⭐', points: 1745, matches: 71, successRate: 81, recentActivity: 'warm' },
  { rank: 5, name: 'Sophia Patel', avatar: '🌟', points: 1620, matches: 65, successRate: 78, recentActivity: 'warm' },
  { rank: 6, name: 'Mason Kim', avatar: '💖', points: 1485, matches: 59, successRate: 74, recentActivity: 'cool' },
  { rank: 7, name: 'Isabella Lopez', avatar: '🎯', points: 1320, matches: 53, successRate: 71, recentActivity: 'cool' },
  { rank: 8, name: 'Ethan Brown', avatar: '🚀', points: 1180, matches: 47, successRate: 68, recentActivity: 'cool' }
]

const trendingPairs = [
  { person1: 'Alex Johnson', person2: 'Jamie Smith', searches: 234, angle: -3 },
  { person1: 'Morgan Davis', person2: 'Riley Martinez', searches: 198, angle: 2 },
  { person1: 'Taylor Brown', person2: 'Casey Wilson', searches: 176, angle: -1 },
  { person1: 'Jordan Anderson', person2: 'Parker Thomas', searches: 154, angle: 4 },
  { person1: 'Avery Jackson', person2: 'Quinn White', searches: 132, angle: -2 }
]

function App() {
  const [currentView, setCurrentView] = useState('questionnaire')
  const [person1, setPerson1] = useState('')
  const [person2, setPerson2] = useState('')
  const [searchTerm1, setSearchTerm1] = useState('')
  const [searchTerm2, setSearchTerm2] = useState('')
  const [showDropdown1, setShowDropdown1] = useState(false)
  const [showDropdown2, setShowDropdown2] = useState(false)
  const [matchScore, setMatchScore] = useState(null)
  const [showScore, setShowScore] = useState(false)
  const [hearts, setHearts] = useState([])
  const [petals, setPetals] = useState([])
  const [isMatching, setIsMatching] = useState(false)
  
  // Questionnaire state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false)

  // Generate floating hearts and petals
  useEffect(() => {
    const generateHeart = () => {
      const id = Date.now() + Math.random()
      const left = Math.random() * 100
      const duration = 12 + Math.random() * 8
      const delay = Math.random() * 3
      const size = 10 + Math.random() * 6
      const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝']
      const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)]

      return { id, left: `${left}%`, animationDuration: `${duration}s`, animationDelay: `${delay}s`, fontSize: `${size}px`, emoji }
    }

    const generatePetal = () => {
      const id = Date.now() + Math.random() + 1000
      const left = Math.random() * 100
      const duration = 15 + Math.random() * 10
      const delay = Math.random() * 5
      const size = 8 + Math.random() * 4

      return { id, left: `${left}%`, animationDuration: `${duration}s`, animationDelay: `${delay}s`, fontSize: `${size}px` }
    }

    const initialHearts = Array.from({ length: 15 }, generateHeart)
    const initialPetals = Array.from({ length: 20 }, generatePetal)
    setHearts(initialHearts)
    setPetals(initialPetals)

    const interval = setInterval(() => {
      setHearts(prev => {
        if (prev.length < 20) return [...prev, generateHeart()]
        return prev
      })
      setPetals(prev => {
        if (prev.length < 25) return [...prev, generatePetal()]
        return prev
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredStudents1 = students.filter(s => 
    s.toLowerCase().includes(searchTerm1.toLowerCase()) && s !== person2
  )

  const filteredStudents2 = students.filter(s => 
    s.toLowerCase().includes(searchTerm2.toLowerCase()) && s !== person1
  )

  const handleMatch = () => {
    if (person1 && person2) {
      setIsMatching(true)
      setTimeout(() => {
        const score = Math.floor(Math.random() * 10) + 1
        setMatchScore(score)
        setIsMatching(false)
        setShowScore(true)
        
        setTimeout(() => {
          setShowScore(false)
          setTimeout(() => setMatchScore(null), 500)
        }, 4000)
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Hearts, Petals & Sparkle Dust */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{
              left: heart.left,
              animationDuration: heart.animationDuration,
              animationDelay: heart.animationDelay,
              fontSize: heart.fontSize
            }}
          >
            {heart.emoji}
          </div>
        ))}
        {petals.map(petal => (
          <div
            key={petal.id}
            className="floating-petal"
            style={{
              left: petal.left,
              animationDuration: petal.animationDuration,
              animationDelay: petal.animationDelay,
              fontSize: petal.fontSize
            }}
          >
            🌸
          </div>
        ))}
        {/* Sparkle Dust */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle-dust"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 8}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="text-center">
              <motion.div 
                className="inline-flex items-center justify-center gap-3 sm:gap-5 mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart fill="currentColor" strokeWidth={0} className="text-hot-pink w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                </motion.div>
                <h1 className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-soft-crimson tracking-wide">
                  Cupid's Ledger
                </h1>
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <Heart fill="currentColor" strokeWidth={0} className="text-hot-pink w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                </motion.div>
              </motion.div>
              <p className="text-soft-crimson/80 text-sm sm:text-base md:text-lg font-sans font-medium tracking-wide">
                Where Hearts Find Their Perfect Match ✨
              </p>
            </div>

            {/* Modern Navigation Pills with Smooth Transitions */}
            <div className="flex justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 flex-wrap px-2 sm:px-4">
              {[
                { id: 'questionnaire', icon: Sparkles, label: "Cupid's Quiz" },
                { id: 'dashboard', icon: Heart, label: 'Match Maker' },
                { id: 'leaderboard', icon: Trophy, label: 'Love Experts' },
                { id: 'trending', icon: Flame, label: 'Campus Crushes' }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = currentView === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCurrentView(tab.id)}
                    className="relative px-4 sm:px-8 py-3 sm:py-4 rounded-full font-sans text-xs sm:text-sm font-semibold transition-colors duration-300"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-hot-pink to-soft-crimson rounded-full shadow-rose"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`flex items-center gap-2 relative z-10 ${
                      isActive ? 'text-white' : 'text-soft-crimson'
                    }`}>
                      <Icon strokeWidth={1.5} size={18} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.header>

        {/* Views Container */}
        <div className="container mx-auto px-4 pb-12 max-w-7xl">
          <AnimatePresence mode="wait">
            {currentView === 'questionnaire' && (
              <Questionnaire
                key="questionnaire"
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                answers={answers}
                setAnswers={setAnswers}
                questionnaireComplete={questionnaireComplete}
                setQuestionnaireComplete={setQuestionnaireComplete}
                setCurrentView={setCurrentView}
              />
            )}

            {currentView === 'dashboard' && (
              <MatchmakerDashboard
                key="dashboard"
                person1={person1}
                person2={person2}
                searchTerm1={searchTerm1}
                searchTerm2={searchTerm2}
                setSearchTerm1={setSearchTerm1}
                setSearchTerm2={setSearchTerm2}
                setPerson1={setPerson1}
                setPerson2={setPerson2}
                showDropdown1={showDropdown1}
                showDropdown2={showDropdown2}
                setShowDropdown1={setShowDropdown1}
                setShowDropdown2={setShowDropdown2}
                filteredStudents1={filteredStudents1}
                filteredStudents2={filteredStudents2}
                handleMatch={handleMatch}
                matchScore={matchScore}
                showScore={showScore}
                isMatching={isMatching}
              />
            )}

            {currentView === 'leaderboard' && (
              <Leaderboard key="leaderboard" data={leaderboardData} />
            )}

            {currentView === 'trending' && (
              <TrendingPairs key="trending" pairs={trendingPairs} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Questionnaire Component
function Questionnaire({ currentQuestion, setCurrentQuestion, answers, setAnswers, questionnaireComplete, setQuestionnaireComplete, setCurrentView }) {
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const question = questions[currentQuestion]

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [question.id]: answer })
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      setQuestionnaireComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (questionnaireComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="frosted-glass-dark rounded-[3rem] p-8 sm:p-12 md:p-16 shadow-rose-lg">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            className="mb-8 relative"
          >
            <Heart strokeWidth={1} fill="currentColor" className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-soft-crimson" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart strokeWidth={1} fill="currentColor" className="w-24 h-24 sm:w-32 sm:h-32 text-soft-crimson blur-2xl opacity-50 animate-glow-pulse" />
            </div>
          </motion.div>
          
          <h2 className="font-script text-3xl sm:text-4xl md:text-5xl text-soft-crimson mb-4">
            Your Heart is Ready
          </h2>
          <p className="text-soft-crimson/70 text-base sm:text-lg mb-8 font-sans">
            Time to discover those destined connections
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('dashboard')}
            className="satin-button px-8 py-4 rounded-full font-sans text-lg inline-flex items-center gap-3"
          >
            Begin Matchmaking
            <ChevronRight strokeWidth={1.5} size={24} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      {/* Modern Progress Bar */}
      <div className="mb-8 sm:mb-12">
        <div className="relative w-full h-3 rounded-full overflow-hidden frosted-glass">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-hot-pink via-soft-crimson to-hot-pink relative shadow-rose"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-slide-fade-in" />
          </motion.div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-soft-crimson/60 text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-soft-crimson text-sm sm:text-base font-sans font-bold">
            {Math.round(progress)}%
          </p>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion}
        initial={{ x: 100, opacity: 0, scale: 0.95 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: -100, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="frosted-glass rounded-3xl p-6 sm:p-10 md:p-12 shadow-rose-lg"
      >
        <div className="flex items-start justify-between mb-8 sm:mb-12">
          <h2 className="font-script text-2xl sm:text-3xl md:text-4xl text-soft-crimson leading-tight flex-1">
            {question.question}
          </h2>
          {question.icon && <question.icon strokeWidth={1.5} className="text-soft-crimson w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 ml-4" />}
        </div>

        {/* Options */}
        <div className="grid gap-4 sm:gap-5">
          {question.options.map((optionObj, index) => {
            const OptionIcon = optionObj.icon
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(optionObj.text)}
                className="group relative frosted-glass hover:bg-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left transition-all duration-300 shadow-rose hover:shadow-rose-lg"
              >
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-hot-pink to-soft-crimson flex items-center justify-center text-white flex-shrink-0 shadow-rose">
                    <OptionIcon strokeWidth={1.5} size={20} />
                  </div>
                  <span className="text-soft-crimson font-sans text-base sm:text-lg md:text-xl font-medium transition-colors">
                    {optionObj.text}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 sm:mt-12">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full font-sans text-sm sm:text-base transition-all ${
              currentQuestion === 0
                ? 'opacity-30 cursor-not-allowed text-soft-crimson/30'
                : 'text-soft-crimson frosted-glass hover:shadow-rose'
            }`}
          >
            <ChevronLeft strokeWidth={1.5} size={20} />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-soft-crimson/60 text-xs sm:text-sm"
          >
            <Heart strokeWidth={1.5} size={16} fill="currentColor" />
            <span className="hidden sm:inline font-sans">Keep going!</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Matchmaker Dashboard Component - Midnight Rose
function MatchmakerDashboard({
  person1, person2, searchTerm1, searchTerm2,
  setSearchTerm1, setSearchTerm2, setPerson1, setPerson2,
  showDropdown1, showDropdown2, setShowDropdown1, setShowDropdown2,
  filteredStudents1, filteredStudents2, handleMatch, matchScore, showScore, isMatching
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      {/* Main Matchmaker Card */}
      <div className="glass-premium rounded-3xl sm:rounded-[3rem] shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16 border border-white/10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-champagne mb-3 tracking-wide">
            Discover Destined Connections
          </h2>
          <p className="text-champagne/70 text-sm sm:text-base md:text-lg font-light tracking-wide">
            Select two souls and unveil their cosmic harmony
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 lg:gap-12 items-start lg:items-center">
          {/* Person 1 Selector */}
          <PersonSelector
            person={person1}
            setPerson={setPerson1}
            searchTerm={searchTerm1}
            setSearchTerm={setSearchTerm1}
            showDropdown={showDropdown1}
            setShowDropdown={setShowDropdown1}
            filteredStudents={filteredStudents1}
            label="First Soul"
            placeholder="Search their name..."
            accentColor="rose-gold"
          />

          {/* Match Button - Desktop */}
          <div className="hidden lg:flex justify-center">
            <MatchButton 
              person1={person1} 
              person2={person2} 
              handleMatch={handleMatch}
              isMatching={isMatching}
            />
          </div>

          {/* Person 2 Selector */}
          <PersonSelector
            person={person2}
            setPerson={setPerson2}
            searchTerm={searchTerm2}
            setSearchTerm={setSearchTerm2}
            showDropdown={showDropdown2}
            setShowDropdown={setShowDropdown2}
            filteredStudents={filteredStudents2}
            label="Second Soul"
            placeholder="Search their match..."
            accentColor="rose-gold"
          />

          {/* Match Button - Mobile */}
          <div className="lg:hidden flex justify-center col-span-1 mt-4">
            <MatchButton 
              person1={person1} 
              person2={person2} 
              handleMatch={handleMatch}
              isMatching={isMatching}
            />
          </div>
        </div>
      </div>

      {/* Score Reveal Modal */}
      <AnimatePresence>
        {showScore && matchScore && (
          <ScoreReveal matchScore={matchScore} person1={person1} person2={person2} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Person Selector Component - Midnight Rose
function PersonSelector({ 
  person, setPerson, searchTerm, setSearchTerm, 
  showDropdown, setShowDropdown, filteredStudents, 
  label, placeholder, accentColor 
}) {
  return (
    <div className="relative w-full">
      <label className="block text-xs sm:text-sm font-light tracking-[0.2em] uppercase text-rose-gold/70 mb-3 sm:mb-4">
        {label}
      </label>
      
      {!person ? (
        <div className="relative">
          <Search strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-gold/50" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 sm:py-5 rounded-2xl border border-rose-gold/20 focus:border-rose-gold/50 focus:outline-none focus:ring-2 focus:ring-rose-gold/20 bg-white/5 backdrop-blur-md transition-all text-sm sm:text-base placeholder:text-champagne/30 text-champagne font-light"
          />
          
          {showDropdown && searchTerm && filteredStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-30 w-full mt-2 glass-dark backdrop-blur-xl rounded-2xl shadow-2xl border border-rose-gold/20 max-h-64 overflow-y-auto"
            >
              {filteredStudents.map(student => (
                <motion.button
                  key={student}
                  whileHover={{ x: 4, backgroundColor: 'rgba(183, 110, 121, 0.1)' }}
                  onClick={() => {
                    setPerson(student)
                    setSearchTerm('')
                    setShowDropdown(false)
                  }}
                  className="w-full text-left px-5 py-4 hover:bg-rose-gold/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-gold/20 to-deep-burgundy/20 border border-rose-gold/30 flex items-center justify-center">
                    <User strokeWidth={1.5} size={18} className="text-rose-gold" />
                  </div>
                  <span className="font-light text-champagne">{student}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative glass-dark rounded-2xl p-5 sm:p-6 border border-rose-gold/30 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-rose-gold/20 to-deep-burgundy/20 border border-rose-gold/30 flex items-center justify-center shadow-xl">
              <User strokeWidth={1.5} size={24} className="text-rose-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-light text-lg sm:text-xl text-champagne truncate">{person}</p>
              <p className="text-xs sm:text-sm text-rose-gold/70 uppercase tracking-wider">Selected</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPerson('')}
              className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-sm shadow-md flex items-center justify-center text-champagne/70 hover:text-champagne hover:bg-rose-gold/20 transition-colors flex-shrink-0 border border-white/10"
            >
              <span className="text-xl font-light">×</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Match Button Component - Midnight Rose
function MatchButton({ person1, person2, handleMatch, isMatching }) {
  const isEnabled = person1 && person2
  
  return (
    <motion.button
      whileHover={isEnabled ? { scale: 1.05 } : {}}
      whileTap={isEnabled ? { scale: 0.95 } : {}}
      onClick={handleMatch}
      disabled={!isEnabled || isMatching}
      className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 ${
        isEnabled
          ? 'ghost-button cursor-pointer'
          : 'bg-white/5 border border-white/10 cursor-not-allowed'
      }`}
    >
      {isMatching ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles strokeWidth={1.5} className="text-rose-gold w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>
      ) : (
        <motion.div
          animate={isEnabled ? {
            scale: [1, 1.15, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <Heart
            strokeWidth={1.5}
            className={`${isEnabled ? 'text-rose-gold' : 'text-champagne/20'} w-10 h-10 sm:w-12 sm:h-12`}
          />
          {isEnabled && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart
                strokeWidth={1.5}
                className="text-rose-gold w-10 h-10 sm:w-12 sm:h-12 blur-lg opacity-40"
              />
            </div>
          )}
        </motion.div>
      )}
      
      {isEnabled && !isMatching && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 20px rgba(183, 110, 121, 0.3)',
              '0 0 40px rgba(183, 110, 121, 0.5)',
              '0 0 20px rgba(183, 110, 121, 0.3)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  )
}

// Score Reveal Component - Midnight Rose
function ScoreReveal({ matchScore, person1, person2 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl px-4"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="enchanted-glass rounded-[3rem] p-8 sm:p-12 text-center max-w-lg w-full shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6 relative"
        >
          <div className="text-7xl sm:text-8xl mb-4">
            {matchScore > 7 ? '💖' : matchScore > 5 ? '💕' : matchScore > 3 ? '💗' : '💔'}
          </div>
        </motion.div>

        <h3 className="font-script text-3xl sm:text-4xl text-soft-crimson mb-4 tracking-wide">
          Love Meter
        </h3>

        <div className="mb-8">
          <p className="text-hot-pink mb-4 text-sm sm:text-base font-semibold tracking-wider">
            {person1} × {person2}
          </p>
          
          {/* Animated Score Circle */}
          <motion.div
            className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6"
            initial={{ rotate: -90 }}
          >
            <svg className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={matchScore > 5 ? "#FFB7C5" : "#D00000"} />
                  <stop offset="100%" stopColor={matchScore > 5 ? "#FFD1DC" : "#FFB7C5"} />
                </linearGradient>
              </defs>
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="rgba(255,183,197,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 85}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - matchScore / 10) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="drop-shadow-[0_0_15px_rgba(255,183,197,0.6)]"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className={`text-5xl sm:text-6xl font-bold ${matchScore > 5 ? 'text-soft-crimson' : 'text-hot-pink'}`}
              >
                {matchScore}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {matchScore > 7 ? (
              <div className="space-y-3">
                <p className="text-2xl font-script text-soft-crimson">Perfect Match! 💖</p>
                <p className="text-hot-pink font-semibold">Destined to be together!</p>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-hot-pink to-rose-pink text-white px-6 py-3 rounded-full font-bold shadow-lg"
                >
                  <Sparkles size={18} />
                  +50 Points
                </motion.div>
              </div>
            ) : matchScore > 5 ? (
              <div className="space-y-3">
                <p className="text-2xl font-script text-soft-crimson">Great Chemistry! 💕</p>
                <p className="text-hot-pink font-semibold">Love is in the air!</p>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-hot-pink to-rose-pink text-white px-6 py-3 rounded-full font-bold shadow-lg"
                >
                  <Heart size={18} />
                  +25 Points
                </motion.div>
              </div>
            ) : matchScore > 3 ? (
              <div className="space-y-3">
                <p className="text-2xl font-script text-hot-pink">It's Okay 💗</p>
                <p className="text-soft-crimson/70 font-semibold">Maybe just friends?</p>
                <div className="inline-flex items-center gap-2 bg-rose-pink/50 text-soft-crimson px-6 py-3 rounded-full font-bold shadow-lg">
                  No Points
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-2xl font-script text-soft-crimson">Not Compatible 💔</p>
                <p className="text-hot-pink font-semibold">Better luck next time!</p>
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-soft-crimson to-hot-pink text-white px-6 py-3 rounded-full font-bold shadow-lg"
                >
                  -10 Points
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Leaderboard Component - Premium Vertical Timeline
function Leaderboard({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      <div className="frosted-glass rounded-[3rem] shadow-rose-lg p-6 sm:p-8 md:p-12">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ type: "spring", duration: 1, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-6"
          >
            <Trophy strokeWidth={1.5} className="w-16 h-16 sm:w-20 sm:h-20 text-soft-crimson" />
          </motion.div>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-soft-crimson mb-3">
            Hall of Fame
          </h2>
          <p className="text-soft-crimson/70 text-sm sm:text-base font-sans">
            The legendary matchmakers who bring hearts together
          </p>
        </div>

        {/* Top 3 Podium - Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {data.slice(0, 3).map((player, index) => {
            const rankColors = {
              1: { gradient: 'from-amber-400 via-yellow-500 to-amber-400', text: 'text-amber-600', icon: Crown },
              2: { gradient: 'from-gray-300 via-zinc-400 to-gray-300', text: 'text-gray-600', icon: Award },
              3: { gradient: 'from-orange-400 via-amber-500 to-orange-400', text: 'text-orange-600', icon: Medal }
            }
            const config = rankColors[player.rank]
            const RankIcon = config.icon

            return (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, type: "spring" }}
                whileHover={{ scale: 1.03, y: -8 }}
                className={`relative glow-ring rounded-3xl p-6 ${
                  player.rank === 1 ? 'md:col-start-2 md:order-first' : ''
                }`}
              >
                <div className="frosted-glass-dark rounded-2xl p-6 h-full flex flex-col items-center">
                  {/* Rank Badge */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-rose-lg mb-4`}>
                    <RankIcon strokeWidth={1.5} className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>

                  {/* Avatar Circle */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-hot-pink to-soft-crimson flex items-center justify-center shadow-rose mb-4">
                    <Heart strokeWidth={1.5} fill="white" className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>

                  {/* Name */}
                  <h3 className={`font-script text-xl sm:text-2xl ${config.text} mb-2 text-center`}>
                    {player.name}
                  </h3>

                  {/* Stats Grid */}
                  <div className="w-full space-y-3 mt-4">
                    <div className="flex items-center justify-between p-3 frosted-glass rounded-xl">
                      <span className="text-soft-crimson/60 text-sm font-sans">Points</span>
                      <span className="text-soft-crimson font-bold text-lg">{player.points.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 frosted-glass rounded-xl">
                      <span className="text-soft-crimson/60 text-sm font-sans">Matches</span>
                      <span className="text-soft-crimson font-bold text-lg">{player.matches}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 frosted-glass rounded-xl">
                      <span className="text-soft-crimson/60 text-sm font-sans">Success</span>
                      <span className="text-soft-crimson font-bold text-lg">{player.successRate}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Remaining Rankings - Vertical Timeline */}
        <div className="space-y-4">
          {data.slice(3).map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: (index + 3) * 0.1 }}
              whileHover={{ scale: 1.02, x: 8 }}
              className="frosted-glass rounded-2xl p-5 sm:p-6 shadow-rose hover:shadow-rose-lg transition-all"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Rank Number */}
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-hot-pink to-soft-crimson flex items-center justify-center shadow-rose">
                  <span className="text-white font-bold text-lg sm:text-xl">#{player.rank}</span>
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-rose-pink to-hot-pink flex items-center justify-center shadow-rose">
                  <User strokeWidth={1.5} size={24} className="text-soft-crimson" />
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-sans font-bold text-base sm:text-lg text-soft-crimson truncate mb-1">
                    {player.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-soft-crimson/60">
                    <span className="flex items-center gap-1">
                      <Heart strokeWidth={1.5} size={14} />
                      {player.matches} matches
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap strokeWidth={1.5} size={14} />
                      {player.successRate}% success
                    </span>
                  </div>
                </div>

                {/* Points Badge */}
                <div className="flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="satin-button px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2"
                  >
                    <Star strokeWidth={1.5} size={16} fill="white" className="text-white" />
                    <span className="text-base sm:text-lg font-bold text-white">
                      {player.points.toLocaleString()}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Your Stats Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 frosted-glass-dark rounded-3xl p-6 sm:p-8 shadow-rose-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-script text-2xl sm:text-3xl text-soft-crimson flex items-center gap-3">
              <User strokeWidth={1.5} className="w-7 h-7" />
              Your Journey
            </h3>
            <Sparkles strokeWidth={1.5} className="w-8 h-8 text-soft-crimson animate-glow-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 frosted-glass rounded-2xl">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-soft-crimson">1,245</p>
              <p className="text-xs sm:text-sm text-soft-crimson/60 mt-2 font-sans">Total Points</p>
            </div>
            <div className="text-center p-4 frosted-glass rounded-2xl">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-soft-crimson">#12</p>
              <p className="text-xs sm:text-sm text-soft-crimson/60 mt-2 font-sans">Your Rank</p>
            </div>
            <div className="text-center p-4 frosted-glass rounded-2xl">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-soft-crimson">50</p>
              <p className="text-xs sm:text-sm text-soft-crimson/60 mt-2 font-sans">Matches Made</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Trending Pairs Component - Stacked Cards with Reveal Animation
function TrendingPairs({ pairs }) {
  const [revealedPairs, setRevealedPairs] = useState([])

  const toggleReveal = (index) => {
    if (revealedPairs.includes(index)) {
      setRevealedPairs(revealedPairs.filter(i => i !== index))
    } else {
      setRevealedPairs([...revealedPairs, index])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      <div className="frosted-glass rounded-[3rem] shadow-rose-lg p-6 sm:p-8 md:p-12">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Flame strokeWidth={1.5} className="w-16 h-16 sm:w-20 sm:h-20 text-soft-crimson" />
          </motion.div>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-soft-crimson mb-3">
            The Buzz
          </h2>
          <p className="text-soft-crimson/70 text-sm sm:text-base font-sans">
            Everyone's curious about these potential love stories
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {pairs.map((pair, index) => {
            const isRevealed = revealedPairs.includes(index)
            return (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="relative group stacked-card"
              >
                {/* Stacked Card Effect - Background cards */}
                <div className="absolute inset-x-0 top-2 h-full frosted-glass rounded-3xl -z-10 scale-[0.97] opacity-50" />
                <div className="absolute inset-x-0 top-4 h-full frosted-glass rounded-3xl -z-20 scale-[0.94] opacity-30" />

                {/* Main Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="frosted-glass-dark rounded-3xl p-6 shadow-rose-lg relative overflow-hidden"
                >
                  {/* Trending Badge */}
                  <div className="absolute -top-3 -right-3 satin-button px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-rose z-10">
                    <TrendingUp strokeWidth={1.5} size={14} />
                    #{index + 1}
                  </div>

                  {/* Person 1 */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-hot-pink to-soft-crimson flex items-center justify-center shadow-rose">
                      <User strokeWidth={1.5} size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold text-base sm:text-lg text-soft-crimson truncate">{pair.person1}</p>
                      <p className="text-xs text-soft-crimson/60 font-sans">First Heart</p>
                    </div>
                  </div>

                  {/* Connection Visual */}
                  <div className="flex items-center justify-center my-6 relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-dashed border-soft-crimson/20"></div>
                    </div>
                    <motion.div
                      animate={{ 
                        scale: isRevealed ? [1, 1.2, 1] : 1,
                        rotate: isRevealed ? [0, 180, 360] : 0
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: isRevealed ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                      className="relative frosted-glass rounded-full p-3 shadow-rose"
                    >
                      <AnimatePresence mode="wait">
                        {isRevealed ? (
                          <motion.div
                            key="heart"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", duration: 0.5 }}
                          >
                            <Heart strokeWidth={1.5} fill="currentColor" className="w-8 h-8 text-soft-crimson" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="eye-off"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <EyeOff strokeWidth={1.5} className="w-8 h-8 text-soft-crimson" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Person 2 */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-pink to-hot-pink flex items-center justify-center shadow-rose">
                      <User strokeWidth={1.5} size={24} className="text-soft-crimson" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold text-base sm:text-lg text-soft-crimson truncate">{pair.person2}</p>
                      <p className="text-xs text-soft-crimson/60 font-sans">Second Heart</p>
                    </div>
                  </div>

                  {/* Reveal Button / Score */}
                  <motion.button
                    onClick={() => toggleReveal(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full frosted-glass rounded-2xl p-4 transition-all hover:shadow-rose"
                  >
                    <AnimatePresence mode="wait">
                      {isRevealed ? (
                        <motion.div
                          key="revealed"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center justify-center gap-3"
                        >
                          <Eye strokeWidth={1.5} className="w-5 h-5 text-soft-crimson" />
                          <span className="text-3xl font-bold text-soft-crimson tracking-wide">
                            {Math.floor(Math.random() * 3) + 7}/10
                          </span>
                          <Heart strokeWidth={1.5} fill="currentColor" className="w-5 h-5 text-soft-crimson" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-3"
                        >
                          <EyeOff strokeWidth={1.5} className="w-5 h-5 text-soft-crimson/60" />
                          <span className="text-xl font-bold text-soft-crimson/60 tracking-wider">? ? ?</span>
                          <span className="text-xs text-soft-crimson/60 font-sans">Click to reveal</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Search Count */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-soft-crimson/60">
                    <Search strokeWidth={1.5} className="w-4 h-4" />
                    <span className="text-sm font-sans font-semibold">
                      {pair.searches} curious searches
                    </span>
                    <Sparkles strokeWidth={1.5} className="w-4 h-4 text-rose-gold" />
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 relative overflow-hidden rounded-3xl frosted-glass-dark shadow-rose-lg"
        >
          <div className="relative p-8 sm:p-10 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Sparkles strokeWidth={1.5} className="w-12 h-12 sm:w-16 sm:h-16 text-soft-crimson" />
            </motion.div>
            
            <h3 className="font-script text-3xl sm:text-4xl md:text-5xl text-soft-crimson mb-4">
              Unlock Their Love Story
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-soft-crimson/70 mb-8 max-w-2xl mx-auto font-sans">
              Be the first to discover if these campus crushes are truly meant to be. 
              Make a match and reveal the hidden compatibility scores!
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="satin-button px-8 py-4 rounded-full font-sans text-base sm:text-lg flex items-center gap-3 mx-auto"
            >
              <Heart strokeWidth={1.5} fill="white" className="w-6 h-6 text-white" />
              Start Matchmaking
              <ChevronRight strokeWidth={1.5} className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default App

