import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Mail } from 'lucide-react'
import { setAuthToken, API_URL } from '../lib/api'

function AuthPage({ onAuth }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      // Redirect the browser to the backend OAuth login endpoint which
      // will forward the user to Google and then back to the backend callback.
      window.location.href = `${API_URL}/auth/login`
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // When backend redirects back to frontend it appends the token and user
  // info in the URL fragment as: /#auth?token=...&email=...&name=...
  // Parse that and finish login.
  useEffect(() => {
    try {
      const hash = window.location.hash || ''
      if (hash.startsWith('#auth')) {
        const qs = hash.slice('#auth'.length)
        const params = new URLSearchParams(qs.replace(/^\?/, ''))
        const token = params.get('token')
        const email = params.get('email')
        const name = params.get('name')
        if (token) {
          setAuthToken(token)
          if (onAuth) onAuth({ email, name })
        }
        // Clean the url
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    } catch {
      // ignore parse errors
    }
  }, [onAuth])

  const hearts = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 800
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800
    const pseudo = (n) => (((n * 9301 + 49297) % 233280) / 233280)
    return Array.from({ length: 8 }, (_, i) => ({
      x: Math.floor(pseudo(i) * vw),
      size: 30 + i * 5,
      viewportHeight: vh,
    }))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Animated Background Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {hearts.map((h, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ x: h.x, y: -50, opacity: 0 }}
            animate={{
              y: h.viewportHeight + 50,
              opacity: [0, 0.3, 0.3, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear',
            }}
          >
            <Heart className="text-deep-crimson" size={h.size} fill="currentColor" opacity={0.1} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
        className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-pink hover:shadow-pink-lg transition-all duration-500 p-6 sm:p-8 md:p-12 max-w-md w-full relative z-10"
      >
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-sans">
            {error}
          </div>
        )}

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
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border-2 border-pink-shadow/30 rounded-2xl p-4 flex items-center justify-center gap-3 hover:border-soft-red hover:shadow-elegant transition-all disabled:opacity-50"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Mail strokeWidth={1.2} className="w-5 h-5 text-deep-crimson" />
          </motion.div>
          <span className="font-sans font-semibold text-charcoal">
            {loading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </motion.button>

        <p className="text-center text-xs text-charcoal/50 mt-6 font-sans">
          Only college email addresses are accepted
        </p>
      </motion.div>
    </motion.div>
  )
}

export { AuthPage }
