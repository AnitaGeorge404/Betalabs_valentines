import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { DoodleEnvelope, DoodleCherub, DoodleBow, DoodleRose } from './Doodles'
import { ShimmerButton } from './RomanticEffects'
import { LottieAccent } from './LottieAccent'
import { mediumHaptic } from '../lib/haptics'

function AuthPage({ onAuth }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGoogleSignIn = async () => {
    mediumHaptic()
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
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
    >
      <LottieAccent
        className="absolute -top-6 -right-5 sm:right-4"
        size={94}
        opacity={0.72}
        variant="birds"
        entranceDelay={0.1}
        floatDistance={10}
        floatDuration={4.6}
        driftX={4}
        rotateRange={4}
      />

      {/* Corner doodles — fixed, subtle */}
      <DoodleCherub className="absolute top-6 left-6 opacity-10 hidden sm:block" size={90} />
      <DoodleRose className="absolute bottom-8 right-8 opacity-10 hidden sm:block" size={70} />
      <DoodleBow className="absolute top-10 right-10 opacity-[0.07] hidden sm:block" size={60} />

      {/* ---- Envelope Card ---- */}
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', bounce: 0.35 }}
        className="relative max-w-md w-full"
      >
        {/* Envelope flap (triangle) */}
        <div className="relative z-10">
          <svg
            viewBox="0 0 400 100"
            className="w-full h-auto -mb-1"
            preserveAspectRatio="none"
          >
            <path
              d="M0 100 L200 15 L400 100 Z"
              fill="#F5EDE6"
              stroke="rgba(98,7,37,0.1)"
              strokeWidth="0.8"
            />
            {/* Wax seal circle */}
            <circle cx="200" cy="72" r="20" fill="#620725" opacity="0.15" />
            <circle cx="200" cy="72" r="14" fill="#620725" opacity="0.08" />
          </svg>
          {/* Heart wax-seal icon centered on flap */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#620725" opacity="0.6" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Card body (the "letter" inside the envelope) */}
        <div className="bg-cream border border-wine/10 rounded-b-organic-lg rounded-t-none px-6 sm:px-10 pb-8 sm:pb-10 pt-10 relative shadow-editorial-lg">
          {/* Subtle paper grain texture */}
          <div className="absolute inset-0 rounded-b-organic-lg opacity-30 pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E\")" }}
          />

          <div className="text-center relative z-10">
            {/* Title */}
            <motion.h1 
              className="font-script text-4xl sm:text-5xl text-wine leading-tight mb-1 dramatic-entrance relative inline-block"
              animate={{ 
                textShadow: [
                  '0 2px 12px rgba(98,7,37,0.2)',
                  '0 4px 24px rgba(98,7,37,0.3)',
                  '0 2px 12px rgba(98,7,37,0.2)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Cupid's Ledger
              <div className="absolute inset-0 blur-2xl bg-wine/10 -z-10" />
            </motion.h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-wine/15" />
              <span className="font-serif text-[0.7rem] tracking-[0.25em] uppercase text-wine/40">
                est. february 2026
              </span>
              <div className="h-px w-10 bg-wine/15" />
            </div>

            <p className="text-ink/60 font-sans text-sm leading-relaxed max-w-xs mx-auto mb-8">
              Open the ledger, find your campus match, and let Cupid do the rest.
            </p>

            {error && (
              <div className="mb-5 px-4 py-2.5 rounded-lg bg-wine/5 border border-wine/10 text-wine text-sm font-sans">
                {error}
              </div>
            )}

            {/* Google Sign-In — styled as wax-sealed invitation */}
            <ShimmerButton
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full btn-wine rounded-xl px-6 py-4 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <DoodleEnvelope size={22} className="opacity-60 [&_*]:!stroke-cream" />
              <span className="font-sans font-semibold text-cream text-sm tracking-wide">
                {loading ? 'Opening the ledger...' : 'Open with Google'}
              </span>
            </ShimmerButton>

            <p className="mt-5 text-xs text-ink/35 font-sans tracking-wide">
              Only <span className="text-wine/50 font-medium">@iiitkottayam.ac.in</span> addresses
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export { AuthPage }
