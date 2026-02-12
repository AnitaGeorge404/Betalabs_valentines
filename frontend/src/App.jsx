import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { registerUser, checkUser } from './lib/api'
import { FloatingHearts } from './components/FloatingHearts'
import { AuthPage } from './components/AuthPage'
import { OnboardingPage } from './components/OnboardingPage'
import { QuizPage } from './components/QuizPage'
import { MatchFinder } from './components/MatchFinder'
import { Leaderboard } from './components/Leaderboard'
import { Profile } from './components/Profile'
import './App.css'

/* ─── inline SVG nav icons (hand-drawn doodle feel) ─── */
const NavSearch = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 1.8 : 1.2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
)
const NavTrophy = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 1.8 : 1.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
)
const NavUser = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 1.8 : 1.2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
)
const HeartLogo = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="#620725" className="flex-shrink-0">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)
const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#620725">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

function App() {
  const [currentPage, setCurrentPage] = useState('loading')
  const [mainTab, setMainTab] = useState('match')
  const [session, setSession] = useState(null)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      if (s) handleAuthUser(s)
      else setCurrentPage('auth')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (s) handleAuthUser(s)
      else { setCurrentPage('auth'); setUserData(null) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleAuthUser = async (s) => {
    try {
      const email = s.user.email
      if (!email.endsWith('@iiitkottayam.ac.in')) {
        await supabase.auth.signOut()
        setCurrentPage('auth')
        return
      }
      const name = s.user.user_metadata?.full_name || s.user.user_metadata?.name || email.split('@')[0]
      const user = await registerUser(email, name)
      setUserData(user)
      const status = await checkUser(email)
      setCurrentPage(status.onboarded ? 'main' : 'onboarding')
    } catch (err) {
      console.error('Auth flow error:', err)
      setCurrentPage('auth')
    }
  }

  const handleOnboardingComplete = () => setCurrentPage('quiz')

  const handleQuizComplete = async () => {
    if (userData?.email) {
      try {
        const status = await checkUser(userData.email)
        if (status.user) setUserData(status.user)
      } catch (e) { console.error(e) }
    }
    setCurrentPage('main')
  }

  const refreshUserData = async () => {
    if (!userData?.email) return
    try {
      const status = await checkUser(userData.email)
      if (status.user) setUserData(status.user)
    } catch (e) { console.error(e) }
  }

  const handleLogout = () => {
    setSession(null)
    setUserData(null)
    setCurrentPage('auth')
  }

  /* ─── Main App Shell ─── */
  const MainApp = () => (
    <div className="min-h-screen pb-24 sm:pb-28">
      {/* Header — parchment with wine accent */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-20 bg-parchment/90 backdrop-blur-md border-b border-wine/8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartLogo />
              <h1 className="font-script text-2xl sm:text-3xl text-wine tracking-wide">Cupid's Ledger</h1>
            </div>
            <div className="flex items-center gap-2.5">
              {userData?.score != null && (
                <div className="flex items-center gap-1 bg-wine/6 rounded-full px-2.5 py-1">
                  <StarIcon />
                  <span className="font-sans font-bold text-wine text-xs">
                    {Math.round(userData.score || 0)}
                  </span>
                  <span className="font-sans text-ink/30 text-[0.55rem] hidden sm:inline">pts</span>
                </div>
              )}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setMainTab('profile')}
                className="w-8 h-8 rounded-full bg-wine flex items-center justify-center relative"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5EDE6"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {mainTab === 'match' && <MatchFinder key="match" userEmail={userData?.email} onMatchComplete={refreshUserData} />}
          {mainTab === 'leaderboard' && <Leaderboard key="leaderboard" />}
          {mainTab === 'profile' && <Profile key="profile" user={userData} onLogout={handleLogout} />}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation — floating glassmorphic pill */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', bounce: 0.25 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-auto sm:bottom-5 sm:w-80 sm:mx-auto z-30 glass-nav"
      >
        <div className="flex justify-around py-2">
          {[
            { id: 'match', Icon: NavSearch, label: 'Find Match' },
            { id: 'leaderboard', Icon: NavTrophy, label: 'Leaderboard' },
            { id: 'profile', Icon: NavUser, label: 'Profile' },
          ].map(({ id, Icon, label }) => {
            const isActive = mainTab === id
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMainTab(id)}
                className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl"
              >
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 bg-wine rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? 'text-cream' : 'text-ink/45'}`}>
                  <Icon active={isActive} />
                </span>
                <span className={`relative z-10 text-[0.55rem] font-sans font-semibold tracking-wide ${
                  isActive ? 'text-cream' : 'text-ink/40'
                }`}>
                  {label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.nav>
    </div>
  )

  /* ─── Loading ─── */
  if (currentPage === 'loading') {
    return (
      <div className="min-h-screen bg-parchment flex flex-col items-center justify-center gap-3">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <HeartLogo />
        </motion.div>
        <span className="font-script text-wine/40 text-sm">Loading…</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parchment relative overflow-hidden">
      <FloatingHearts />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentPage === 'auth' && <AuthPage key="auth" />}
          {currentPage === 'onboarding' && <OnboardingPage key="onboarding" onComplete={handleOnboardingComplete} />}
          {currentPage === 'quiz' && <QuizPage key="quiz" userEmail={userData?.email} onComplete={handleQuizComplete} />}
          {currentPage === 'main' && <MainApp key="main" />}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App

