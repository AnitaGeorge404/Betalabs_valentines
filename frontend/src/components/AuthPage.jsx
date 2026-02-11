import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { registerUser, checkUser } from '../lib/api'

function AuthPage({ onAuth }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            hd: 'iiitkottayam.ac.in',
          },
        },
      })
      if (authError) throw authError
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-neo-white"
    >
      {/* Animated Background Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              y: -50,
              opacity: 0
            }}
            animate={{
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
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
              className="text-soft-red"
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
        className="neo-card p-6 sm:p-8 md:p-12 max-w-md w-full relative z-10"
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
            <div className="neo-circle w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 flex items-center justify-center">
              <Heart
                strokeWidth={0}
                fill="currentColor"
                className="w-12 h-12 sm:w-16 sm:h-16 text-soft-red"
              />
            </div>
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
          
          <div className="neo-pressed py-3 px-6 mb-3 inline-block rounded-full">
            <h1 className="font-script text-4xl sm:text-5xl text-soft-red">
              Cupid's Ledger
            </h1>
          </div>
          
          <div className="neo-flat py-2 px-4 inline-block rounded-full">
            <p className="text-charcoal/70 font-sans text-sm">
              Find your perfect match on campus
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 neo-pressed rounded-xl text-soft-red text-sm text-center font-sans">
            {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97, boxShadow: "inset 2px 2px 5px rgba(163, 177, 198, 0.6), inset -2px -2px 5px rgba(255, 255, 255, 0.9)" }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full neo-btn-primary rounded-2xl p-4 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="neo-circle w-8 h-8 flex items-center justify-center bg-white/20"
          >
            <Mail strokeWidth={1.2} className="w-4 h-4 text-white" />
          </motion.div>
          <span className="font-sans font-semibold text-white">
            {loading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </motion.button>

        <div className="neo-pressed mt-6 py-2 px-4 rounded-full mx-auto w-fit">
          <p className="text-center text-xs text-charcoal/70 font-sans">
            Only college email addresses are accepted
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export { AuthPage }
