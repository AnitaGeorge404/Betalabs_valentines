import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trophy, Search, User } from 'lucide-react'
import { registerUser, checkUser, getAuthToken } from './lib/api'
import { FloatingHearts } from './components/FloatingHearts'
import { AuthPage } from './components/AuthPage'
import { OnboardingPage } from './components/OnboardingPage'
import { QuizPage } from './components/QuizPage'
import { MatchFinder } from './components/MatchFinder'
import { Leaderboard } from './components/Leaderboard'
import { Profile } from './components/Profile'
import './App.css'

function MainApp({ mainTab, setMainTab, userData, handleLogout }) {
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
              onClick={() => setMainTab('profile')}
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
          {mainTab === 'match' && <MatchFinder key="match" userEmail={userData?.email} />}
          {mainTab === 'leaderboard' && <Leaderboard key="leaderboard" />}
          {mainTab === 'profile' && <Profile key="profile" user={userData} onLogout={handleLogout} />}
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

function App() {
  const [currentPage, setCurrentPage] = useState('loading') // loading, auth, onboarding, quiz, main
  const [mainTab, setMainTab] = useState('match') // match, leaderboard, profile
  // session state (previously used with Supabase) removed; JWT/localStorage now used
  const [userData, setUserData] = useState(null)

  // Initialize auth from stored token/user (from OAuth flow)
  useEffect(() => {
    (async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          setCurrentPage('auth')
          return
        }

        const stored = localStorage.getItem('user')
        if (stored) {
          const parsed = JSON.parse(stored)
          setUserData(parsed)
          // Check onboarding status
          try {
            const status = await checkUser(parsed.email)
            if (status.onboarded) setCurrentPage('main')
            else setCurrentPage('onboarding')
          } catch (e) {
            console.error('Failed to check user:', e)
            setCurrentPage('auth')
          }
        } else {
          setCurrentPage('auth')
        }
      } catch (e) {
        console.error(e)
        setCurrentPage('auth')
      }
    })()
  }, [])

  const handleAuthUser = async ({ email, name }) => {
    try {
      // Persist minimal user locally
      const user = { email, name }
      setUserData(user)
      localStorage.setItem('user', JSON.stringify(user))

      // Ensure user exists on backend (create if missing)
      await registerUser(email, name)

      // Check onboarding status
      const status = await checkUser(email)
      if (status.onboarded) setCurrentPage('main')
      else setCurrentPage('onboarding')
    } catch (err) {
      console.error('Auth flow error:', err)
      setCurrentPage('auth')
    }
  }

  const handleOnboardingComplete = () => {
    setCurrentPage('quiz')
  }

  const handleQuizComplete = async () => {
    // Refresh user data after quiz
    if (userData?.email) {
      try {
        const status = await checkUser(userData.email)
        if (status.user) setUserData(status.user)
      } catch (e) {
        console.error(e)
      }
    }
    setCurrentPage('main')
  }

  const handleLogout = () => {
    setUserData(null)
    setCurrentPage('auth')
  }

  // MainApp moved out of render to top-level to avoid recreating component each render

  // Loading screen
  if (currentPage === 'loading') {
    return (
      <div className="min-h-screen bg-light-pink flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Heart strokeWidth={0} fill="currentColor" className="w-16 h-16 text-deep-crimson" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-pink relative overflow-hidden">
      <FloatingHearts />

      {/* Main Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentPage === 'auth' && <AuthPage key="auth" onAuth={handleAuthUser} />}
          {currentPage === 'onboarding' && (
            <OnboardingPage key="onboarding" onComplete={handleOnboardingComplete} />
          )}
          {currentPage === 'quiz' && (
            <QuizPage
              key="quiz"
              userEmail={userData?.email}
              onComplete={handleQuizComplete}
            />
          )}
          {currentPage === 'main' && (
            <MainApp
              key="main"
              mainTab={mainTab}
              setMainTab={setMainTab}
              userData={userData}
              handleLogout={handleLogout}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App

