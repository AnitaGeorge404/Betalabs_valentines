import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trophy, Search, User, Sparkles, Lock, Crown, Zap, TrendingUp, Star } from 'lucide-react'
import './App.css'

// Mock data
const students = [
  'Alex Johnson', 'Jamie Smith', 'Taylor Brown', 'Morgan Davis', 'Casey Wilson',
  'Riley Martinez', 'Jordan Anderson', 'Parker Thomas', 'Avery Jackson', 'Quinn White',
  'Cameron Harris', 'Sage Martin', 'Drew Thompson', 'Reese Garcia', 'Skylar Robinson',
  'Emerson Clark', 'Rowan Lewis', 'Finley Lee', 'Hayden Walker', 'Blake Hall'
]

const leaderboardData = [
  { rank: 1, name: 'Emma Thompson', avatar: '👑', points: 2450, matches: 98 },
  { rank: 2, name: 'Liam Chen', avatar: '✨', points: 2210, matches: 87 },
  { rank: 3, name: 'Olivia Rodriguez', avatar: '💫', points: 1980, matches: 79 },
  { rank: 4, name: 'Noah Williams', avatar: '⭐', points: 1745, matches: 71 },
  { rank: 5, name: 'Sophia Patel', avatar: '🌟', points: 1620, matches: 65 },
  { rank: 6, name: 'Mason Kim', avatar: '💖', points: 1485, matches: 59 },
  { rank: 7, name: 'Isabella Lopez', avatar: '🎯', points: 1320, matches: 53 },
  { rank: 8, name: 'Ethan Brown', avatar: '🚀', points: 1180, matches: 47 }
]

const trendingPairs = [
  { person1: 'Alex Johnson', person2: 'Jamie Smith', searches: 234 },
  { person1: 'Morgan Davis', person2: 'Riley Martinez', searches: 198 },
  { person1: 'Taylor Brown', person2: 'Casey Wilson', searches: 176 },
  { person1: 'Jordan Anderson', person2: 'Parker Thomas', searches: 154 },
  { person1: 'Avery Jackson', person2: 'Quinn White', searches: 132 }
]

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [person1, setPerson1] = useState('')
  const [person2, setPerson2] = useState('')
  const [searchTerm1, setSearchTerm1] = useState('')
  const [searchTerm2, setSearchTerm2] = useState('')
  const [showDropdown1, setShowDropdown1] = useState(false)
  const [showDropdown2, setShowDropdown2] = useState(false)
  const [matchScore, setMatchScore] = useState(null)
  const [showScore, setShowScore] = useState(false)
  const [hearts, setHearts] = useState([])
  const [isMatching, setIsMatching] = useState(false)

  // Generate floating hearts
  useEffect(() => {
    const generateHeart = () => {
      const id = Date.now() + Math.random()
      const left = Math.random() * 100
      const duration = 10 + Math.random() * 8
      const delay = Math.random() * 3
      const size = 12 + Math.random() * 8
      const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝']
      const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)]

      return {
        id,
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        fontSize: `${size}px`,
        emoji
      }
    }

    const initialHearts = Array.from({ length: 20 }, generateHeart)
    setHearts(initialHearts)

    const interval = setInterval(() => {
      setHearts(prev => {
        if (prev.length < 25) {
          return [...prev, generateHeart()]
        }
        return prev
      })
    }, 4000)

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
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/40 via-transparent to-rose-100/40 animate-pulse-slow"></div>
      </div>

      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="floating-heart absolute opacity-20"
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
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="pt-8 pb-6 px-4"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center">
              <motion.div 
                className="inline-flex items-center justify-center gap-3 mb-3"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <Heart className="fill-rose-500 text-rose-500 w-12 h-12 md:w-16 md:h-16" />
                </motion.div>
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  Cupid's Ledger
                </h1>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    delay: 0.5
                  }}
                >
                  <Heart className="fill-rose-500 text-rose-500 w-12 h-12 md:w-16 md:h-16" />
                </motion.div>
              </motion.div>
              <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium">
                Where Hearts Connect & Love Perfects ✨
              </p>
            </div>

            {/* Navigation Pills */}
            <div className="flex justify-center gap-2 sm:gap-4 mt-8 flex-wrap px-4">
              {[
                { id: 'dashboard', icon: Heart, label: 'Match', gradient: 'from-rose-500 to-pink-500' },
                { id: 'leaderboard', icon: Trophy, label: 'Rankings', gradient: 'from-amber-500 to-orange-500' },
                { id: 'trending', icon: TrendingUp, label: 'Trending', gradient: 'from-purple-500 to-pink-500' }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = currentView === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView(tab.id)}
                    className={`relative px-4 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl`
                        : 'bg-white/60 backdrop-blur-md text-gray-700 hover:bg-white shadow-lg'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-2xl`}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <span className="flex items-center gap-2 relative z-10">
                      <Icon size={20} />
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

// Matchmaker Dashboard Component
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
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[3rem] shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16 border border-white/50">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Discover Love's Chemistry
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Select two hearts and see if they're meant to beat as one 💕
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
            label="First Heart"
            placeholder="Search your crush..."
            accentColor="rose"
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
            label="Second Heart"
            placeholder="Search their match..."
            accentColor="pink"
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

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 md:mt-12 grid grid-cols-3 gap-3 sm:gap-4 md:gap-6"
        >
          {[
            { label: 'Total Matches', value: '1,234', icon: Heart, color: 'rose' },
            { label: 'Success Rate', value: '87%', icon: Star, color: 'amber' },
            { label: 'Active Today', value: '456', icon: Sparkles, color: 'purple' }
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100/50 rounded-2xl p-3 sm:p-4 md:p-6 text-center border border-${stat.color}-200/50`}
              >
                <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-${stat.color}-600`} />
                <p className={`text-xl sm:text-2xl md:text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
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

// Person Selector Component
function PersonSelector({ 
  person, setPerson, searchTerm, setSearchTerm, 
  showDropdown, setShowDropdown, filteredStudents, 
  label, placeholder, accentColor 
}) {
  return (
    <div className="relative w-full">
      <label className="block text-sm sm:text-base font-bold text-gray-700 mb-3 sm:mb-4">
        {label}
      </label>
      
      {!person ? (
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-${accentColor}-400`} size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className={`w-full pl-12 pr-4 py-4 sm:py-5 rounded-2xl border-2 border-${accentColor}-200 focus:border-${accentColor}-500 focus:outline-none focus:ring-4 focus:ring-${accentColor}-100 bg-white transition-all text-sm sm:text-base placeholder:text-gray-400`}
          />
          
          {showDropdown && searchTerm && filteredStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute z-30 w-full mt-2 bg-white rounded-2xl shadow-2xl border-2 border-${accentColor}-100 max-h-64 overflow-y-auto`}
            >
              {filteredStudents.map(student => (
                <motion.button
                  key={student}
                  whileHover={{ backgroundColor: `rgb(var(--${accentColor}-50))`, x: 4 }}
                  onClick={() => {
                    setPerson(student)
                    setSearchTerm('')
                    setShowDropdown(false)
                  }}
                  className="w-full text-left px-5 py-4 hover:bg-gradient-to-r from-rose-50 to-pink-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${accentColor}-400 to-${accentColor}-600 flex items-center justify-center`}>
                    <User size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{student}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`relative bg-gradient-to-br from-${accentColor}-100 to-${accentColor}-50 rounded-2xl p-5 sm:p-6 border-2 border-${accentColor}-300 shadow-lg`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-${accentColor}-500 to-${accentColor}-700 flex items-center justify-center shadow-xl`}>
              <User size={28} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg sm:text-xl text-gray-800 truncate">{person}</p>
              <p className="text-sm text-gray-600">Selected</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPerson('')}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
            >
              <span className="text-xl">×</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Match Button Component
function MatchButton({ person1, person2, handleMatch, isMatching }) {
  const isEnabled = person1 && person2
  
  return (
    <motion.button
      whileHover={isEnabled ? { scale: 1.1, rotate: [0, -5, 5, 0] } : {}}
      whileTap={isEnabled ? { scale: 0.95 } : {}}
      onClick={handleMatch}
      disabled={!isEnabled || isMatching}
      className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
        isEnabled
          ? 'bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 hover:shadow-rose-500/50 cursor-pointer'
          : 'bg-gray-300 cursor-not-allowed'
      }`}
    >
      {isMatching ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="text-white w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>
      ) : (
        <motion.div
          animate={isEnabled ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart
            className={`${isEnabled ? 'fill-white text-white' : 'text-gray-500'} w-10 h-10 sm:w-12 sm:h-12`}
          />
        </motion.div>
      )}
      
      {isEnabled && !isMatching && (
        <motion.div
          className="absolute inset-0 rounded-full bg-rose-400"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
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

// Score Reveal Component
function ScoreReveal({ matchScore, person1, person2 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white/95 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 text-center max-w-lg w-full shadow-2xl border-4 border-rose-200"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <div className="text-7xl sm:text-8xl mb-4">
            {matchScore > 7 ? '🔥' : matchScore > 5 ? '💖' : matchScore > 3 ? '💕' : '💔'}
          </div>
        </motion.div>

        <h3 className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Love Compatibility
        </h3>

        <div className="mb-8">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            {person1} × {person2}
          </p>
          
          {/* Animated Score Circle */}
          <motion.div
            className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6"
            initial={{ rotate: -90 }}
          >
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="#f0f0f0"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke={matchScore > 5 ? "#10b981" : "#ef4444"}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 85}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - matchScore / 10) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-5xl sm:text-6xl font-bold ${matchScore > 5 ? 'text-green-600' : 'text-red-600'}`}
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
                <p className="text-2xl font-bold text-green-600">Perfect Match! 🎉</p>
                <p className="text-gray-600">This is destiny! Sparks are flying everywhere!</p>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold"
                >
                  <Sparkles size={20} />
                  +50 Points
                </motion.div>
              </div>
            ) : matchScore > 5 ? (
              <div className="space-y-3">
                <p className="text-2xl font-bold text-green-600">Great Chemistry! ✨</p>
                <p className="text-gray-600">There's definitely something here!</p>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold"
                >
                  <Sparkles size={20} />
                  +25 Points
                </motion.div>
              </div>
            ) : matchScore > 3 ? (
              <div className="space-y-3">
                <p className="text-2xl font-bold text-orange-600">Hmm, Maybe... 🤔</p>
                <p className="text-gray-600">Could work with some effort!</p>
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-3 rounded-full font-bold">
                  No Points
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-2xl font-bold text-red-600">Not Quite... 💔</p>
                <p className="text-gray-600">Sometimes hearts just don't align!</p>
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-full font-bold"
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

