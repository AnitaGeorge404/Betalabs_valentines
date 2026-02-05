import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trophy, Search, User, Sparkles, Lock, Crown, Zap, TrendingUp, Star, ChevronRight, ChevronLeft, Flame, Award } from 'lucide-react'
import './App.css'

// Questionnaire Data
const questions = [
  {
    id: 1,
    question: "Pineapple on pizza: Dealbreaker or Love language?",
    options: ["Absolute dealbreaker! 🚫", "Love language! 🍍", "I'm Switzerland 🤷"]
  },
  {
    id: 2,
    question: "Are you an Early bird or Night owl?",
    options: ["Early bird 🌅", "Night owl 🦉", "Whenever the vibe hits ✨"]
  },
  {
    id: 3,
    question: "First date: Library or Beach?",
    options: ["Library vibes 📚", "Beach vibes 🏖️", "Coffee shop compromise ☕"]
  },
  {
    id: 4,
    question: "Your go-to Friday night?",
    options: ["Party hard 🎉", "Netflix & chill 🎬", "Dinner with close friends 🍽️"]
  },
  {
    id: 5,
    question: "Love language preference?",
    options: ["Words of affirmation 💬", "Physical touch 🤗", "Quality time ⏰", "Acts of service 🎁"]
  },
  {
    id: 6,
    question: "Texting style?",
    options: ["Essay writer 📝", "One-word wonder 👍", "Emoji enthusiast 😊"]
  },
  {
    id: 7,
    question: "Dream vacation?",
    options: ["Adventure sports 🏔️", "Cultural exploration 🏛️", "Beach resort 🏝️", "Staycation 🏠"]
  },
  {
    id: 8,
    question: "How do you handle conflicts?",
    options: ["Talk it out immediately 💬", "Need space first 🚶", "Avoid at all costs 🙈"]
  },
  {
    id: 9,
    question: "Your ideal Saturday morning?",
    options: ["Sleep in till noon 😴", "Early workout 💪", "Brunch with friends 🥞"]
  },
  {
    id: 10,
    question: "Pet preference?",
    options: ["Dog person 🐕", "Cat person 🐱", "All animals! 🦜", "No pets 🚫"]
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
                  className="relative"
                >
                  <Heart className="fill-deep-crimson text-deep-crimson w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 drop-shadow-[0_0_15px_rgba(208,0,0,0.6)]" />
                </motion.div>
                <h1 className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-deep-crimson tracking-wide drop-shadow-[0_2px_10px_rgba(208,0,0,0.3)]">
                  Cupid's Ledger
                </h1>
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="relative"
                >
                  <Heart className="fill-deep-crimson text-deep-crimson w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 drop-shadow-[0_0_15px_rgba(208,0,0,0.6)]" />
                </motion.div>
              </motion.div>
              <p className="text-deep-crimson text-sm sm:text-base md:text-lg font-sans font-semibold tracking-wide">
                Where Hearts Find Their Perfect Match 💕✨
              </p>
            </div>

            {/* Whimsical Navigation Pills */}
            <div className="flex justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 flex-wrap px-2 sm:px-4">
              {[
                { id: 'questionnaire', icon: Sparkles, label: "Cupid's Quiz", color: 'from-soft-rose to-blush-pink' },
                { id: 'dashboard', icon: Heart, label: 'Match Maker', color: 'from-deep-crimson to-soft-rose' },
                { id: 'leaderboard', icon: Trophy, label: 'Love Experts', color: 'from-blush-pink to-soft-rose' },
                { id: 'trending', icon: Flame, label: 'Campus Crushes', color: 'from-soft-rose to-deep-crimson' }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = currentView === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView(tab.id)}
                    className={`relative px-4 sm:px-8 py-3 sm:py-4 rounded-full font-sans text-xs sm:text-sm font-bold transition-all duration-300 shadow-lg ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white animate-gentle-pulse`
                        : 'enchanted-glass text-deep-crimson hover:shadow-xl'
                    }`}
                  >
                    <span className="flex items-center gap-2 relative z-10">
                      <Icon size={18} />
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
        <div className="glass-dark rounded-[3rem] p-8 sm:p-12 md:p-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            className="mb-8 relative"
          >
            <Heart strokeWidth={1} className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-rose-gold" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart strokeWidth={1} className="w-24 h-24 sm:w-32 sm:h-32 text-rose-gold blur-2xl opacity-50" />
            </div>
          </motion.div>
          
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-champagne mb-4">
            Your Heart is Ready
          </h2>
          <p className="text-champagne/70 text-base sm:text-lg mb-8 font-light">
            Time to discover those destined connections
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('dashboard')}
            className="ghost-button px-8 py-4 rounded-full font-light text-lg inline-flex items-center gap-3"
          >
            Begin Matchmaking
            <ChevronRight strokeWidth={1.5} size={24} />
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl mx-auto"
    >
      {/* Liquid Progress Bar */}
      <div className="mb-8 sm:mb-12">
        <div className="relative w-full h-2 rounded-full overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="liquid-bar h-full bg-gradient-to-r from-rose-gold via-champagne to-rose-gold relative"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-champagne/50 text-xs sm:text-sm font-light tracking-[0.2em] uppercase">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-rose-gold text-sm sm:text-base font-light">
            {Math.round(progress)}%
          </p>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion}
        initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
        animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
        exit={{ x: -100, opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-dark rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 md:p-12 inner-glow"
      >
        <div className="flex items-start justify-between mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-champagne leading-tight flex-1">
            {question.question}
          </h2>
          <Sparkles strokeWidth={1.5} className="text-rose-gold w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 ml-4" />
        </div>

        {/* Options */}
        <div className="grid gap-4 sm:gap-5">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option)}
              className="group relative glass-dark hover:bg-white/5 border border-transparent hover:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left transition-all duration-500"
            >
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-rose-gold/30 group-hover:border-rose-gold flex items-center justify-center font-light text-champagne/70 group-hover:text-champagne text-sm sm:text-base flex-shrink-0 transition-all">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-champagne/70 group-hover:text-champagne font-light text-base sm:text-lg md:text-xl transition-colors">
                  {option}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 sm:mt-12">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full font-light transition-all text-sm sm:text-base ${
              currentQuestion === 0
                ? 'opacity-20 cursor-not-allowed text-champagne/30'
                : 'text-champagne/70 hover:text-champagne ghost-button'
            }`}
          >
            <ChevronLeft strokeWidth={1.5} size={20} />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentQuestion ? 'w-8 bg-rose-gold shadow-[0_0_10px_rgba(183,110,121,0.5)]' : 
                  index < currentQuestion ? 'w-1.5 bg-rose-gold/50' : 
                  'w-1.5 bg-white/10'
                }`}
              />
            ))}
          </div>

          <div className="w-24 sm:w-32"></div>
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

        <h3 className="font-script text-3xl sm:text-4xl text-deep-crimson mb-4 tracking-wide">
          Love Meter
        </h3>

        <div className="mb-8">
          <p className="text-soft-rose mb-4 text-sm sm:text-base font-semibold tracking-wider">
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
                className={`text-5xl sm:text-6xl font-bold ${matchScore > 5 ? 'text-deep-crimson' : 'text-soft-rose'}`}
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
                <p className="text-2xl font-script text-deep-crimson">Perfect Match! 💖</p>
                <p className="text-soft-rose font-semibold">Destined to be together!</p>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-soft-rose to-blush-pink text-white px-6 py-3 rounded-full font-bold shadow-lg"
                >
                  <Sparkles size={18} />
                  +50 Points
                </motion.div>
              </div>
            ) : matchScore > 5 ? (
              <div className="space-y-3">
                <p className="text-2xl font-script text-deep-crimson">Great Chemistry! 💕</p>
                <p className="text-soft-rose font-semibold">Love is in the air!</p>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-soft-rose to-blush-pink text-white px-6 py-3 rounded-full font-bold shadow-lg"
                >
                  <Heart size={18} />
                  +25 Points
                </motion.div>
              </div>
            ) : matchScore > 3 ? (
              <div className="space-y-3">
                <p className="text-2xl font-script text-soft-rose">It's Okay 💗</p>
                <p className="text-deep-crimson/70 font-semibold">Maybe just friends?</p>
                <div className="inline-flex items-center gap-2 bg-blush-pink/50 text-deep-crimson px-6 py-3 rounded-full font-bold shadow-lg">
                  No Points
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-2xl font-script text-deep-crimson">Not Compatible 💔</p>
                <p className="text-soft-rose font-semibold">Better luck next time!</p>
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-deep-crimson to-soft-rose text-white px-6 py-3 rounded-full font-bold shadow-lg"
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

// Leaderboard Component
function Leaderboard({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[3rem] shadow-2xl p-6 sm:p-8 md:p-12 border border-white/50">
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 360] }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-block mb-4"
          >
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500" />
          </motion.div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Hall of Cupids
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            The legendary matchmakers who bring hearts together 💘
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {data.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.02, x: 8 }}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl transition-all ${
                player.rank === 1
                  ? 'bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-200 border-3 border-yellow-400 shadow-xl shadow-yellow-200/50'
                  : player.rank === 2
                  ? 'bg-gradient-to-r from-gray-200 via-zinc-200 to-gray-200 border-3 border-gray-400 shadow-xl shadow-gray-200/50'
                  : player.rank === 3
                  ? 'bg-gradient-to-r from-orange-200 via-amber-100 to-orange-200 border-3 border-orange-400 shadow-xl shadow-orange-200/50'
                  : 'bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-lg'
              }`}
            >
              {/* Rank Badge */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 p-4 sm:p-5 md:p-6">
                <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center ${
                  player.rank <= 3 ? 'bg-white/40 backdrop-blur-sm' : 'bg-gradient-to-br from-rose-100 to-pink-100'
                }`}>
                  {player.rank <= 3 ? (
                    <span className="text-4xl sm:text-5xl">{player.rank === 1 ? '👑' : player.rank === 2 ? '⭐' : '🌟'}</span>
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold text-gray-600">#{player.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg ${
                  player.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
                  player.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-zinc-400' :
                  player.rank === 3 ? 'bg-gradient-to-br from-orange-300 to-amber-400' :
                  'bg-gradient-to-br from-rose-300 to-pink-400'
                }`}>
                  {player.avatar}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-800 truncate">
                    {player.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <p className="text-xs sm:text-sm text-gray-600">
                      {player.matches} perfect matches
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                    <span className="text-lg sm:text-xl md:text-2xl font-bold">
                      {player.points.toLocaleString()}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Your Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl sm:text-2xl flex items-center gap-2">
              <User className="w-6 h-6" />
              Your Journey
            </h3>
            <Star className="w-8 h-8 fill-white" />
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold">1,245</p>
              <p className="text-xs sm:text-sm opacity-90 mt-1">Total Points</p>
            </div>
            <div className="text-center border-x border-white/30">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold">#12</p>
              <p className="text-xs sm:text-sm opacity-90 mt-1">Your Rank</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold">50</p>
              <p className="text-xs sm:text-sm opacity-90 mt-1">Matches Made</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Trending Pairs Component
function TrendingPairs({ pairs }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[3rem] shadow-2xl p-6 sm:p-8 md:p-12 border border-white/50">
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="inline-block mb-4"
          >
            <TrendingUp className="w-16 h-16 sm:w-20 sm:h-20 text-purple-500" />
          </motion.div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Campus Buzz
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Everyone's curious about these potential love stories 👀💕
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {pairs.map((pair, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ delay: index * 0.15, type: "spring" }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-white via-rose-50/30 to-pink-50/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-rose-200/50 hover:border-rose-300 transition-all">
                {/* Popularity Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg z-10"
                >
                  <TrendingUp size={14} />
                  #{index + 1}
                </motion.div>

                {/* Person 1 */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
                    <User size={28} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base sm:text-lg text-gray-800 truncate">{pair.person1}</p>
                    <p className="text-xs text-gray-500">Heart #1</p>
                  </div>
                </div>

                {/* Connection Visual */}
                <div className="flex items-center justify-center my-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-rose-300"></div>
                  </div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative bg-white rounded-full p-3 shadow-lg"
                  >
                    <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
                  </motion.div>
                </div>

                {/* Person 2 */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                    <User size={28} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base sm:text-lg text-gray-800 truncate">{pair.person2}</p>
                    <p className="text-xs text-gray-500">Heart #2</p>
                  </div>
                </div>

                {/* Score - Hidden */}
                <div className="relative overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 rounded-2xl p-4 text-center backdrop-blur-sm border border-rose-200">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Lock className="w-5 h-5 text-rose-600" />
                      <span className="text-3xl font-bold text-rose-600 tracking-wider">? ? ?</span>
                      <Lock className="w-5 h-5 text-rose-600" />
                    </div>
                    <p className="text-xs text-gray-600 font-semibold">Match Score Classified</p>
                  </div>
                  
                  {/* Hover reveal hint */}
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"></div>
                </div>

                {/* Search Count */}
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
                  <Search className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {pair.searches} curious searches
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 opacity-90"></div>
          <div className="relative p-8 sm:p-10 text-center text-white">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 right-4 opacity-20"
            >
              <Crown size={100} />
            </motion.div>
            
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16" />
            </motion.div>
            
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Unlock Their Love Story!
            </h3>
            <p className="text-sm sm:text-base md:text-lg opacity-95 mb-6 max-w-2xl mx-auto">
              Be the first to discover if these campus crushes are truly meant to be. 
              Make a match and reveal the hidden compatibility scores! ✨
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-white text-rose-600 px-8 py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/20 transition-all"
            >
              <Heart className="w-6 h-6 fill-rose-600" />
              Start Matchmaking
              <Sparkles className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default App

