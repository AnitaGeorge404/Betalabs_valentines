import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, X, Clock } from 'lucide-react'
import { searchUsers, makeMatch, getCooldown } from '../lib/api'
import { DoodleLock, DoodleKey, DoodleDivider, InkSplatter, QuillPen } from './Doodles'
import { RomanticCard, ShimmerButton, FloatingMiniHearts } from './RomanticEffects'
import { LottieAccent } from './LottieAccent'
import { mediumHaptic, celebrationHaptic, selectionHaptic, heartbeatHaptic } from '../lib/haptics'

function formatBatchYear(user) {
  if (!user?.year) return ''
  const batch = user.batch ? `Batch ${user.batch}` : ''
  const yr = user.year ? `${user.year}` : ''
  return [batch, yr].filter(Boolean).join(' · ')
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

/* Inline heart SVG to avoid lucide import */
const HeartIcon = ({ className = '', size = 20, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth="1.5" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

function MatchFinder({ userEmail, onMatchComplete }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searching, setSearching] = useState(false)
  const [selectedPerson1, setSelectedPerson1] = useState(null)
  const [selectedPerson2, setSelectedPerson2] = useState(null)
  const [matchResult, setMatchResult] = useState(null)
  const [matching, setMatching] = useState(false)
  const [error, setError] = useState(null)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const searchRef = useRef(null)
  const debouncedQuery = useDebounce(searchQuery, 400)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setSuggestions([]); setShowDropdown(false); return
    }
    setSearching(true)
    searchUsers(debouncedQuery)
      .then((data) => {
        const filtered = data.filter(s => s.email !== selectedPerson1?.email && s.email !== selectedPerson2?.email)
        setSuggestions(filtered); setShowDropdown(filtered.length > 0)
      })
      .catch(() => setSuggestions([]))
      .finally(() => setSearching(false))
  }, [debouncedQuery, selectedPerson1?.email, selectedPerson2?.email])

  useEffect(() => {
    if (!userEmail) return
    getCooldown(userEmail).then((res) => {
      if (res.cooldown) setCooldownRemaining(res.remaining_seconds)
    }).catch(() => {})
  }, [userEmail])

  useEffect(() => {
    if (cooldownRemaining <= 0) return
    const interval = setInterval(() => {
      setCooldownRemaining(prev => { if (prev <= 1) { clearInterval(interval); return 0 } return prev - 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [cooldownRemaining])

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectPerson = useCallback((student) => {
    selectionHaptic()
    if (!selectedPerson1) setSelectedPerson1(student)
    else if (!selectedPerson2) {
      setSelectedPerson2(student)
      heartbeatHaptic()
    }
    setSearchQuery(''); setSuggestions([]); setShowDropdown(false)
  }, [selectedPerson1, selectedPerson2])

  const handleMatch = async () => {
    if (!selectedPerson1 || !selectedPerson2 || cooldownRemaining > 0) return
    mediumHaptic()
    setMatching(true); setError(null); setMatchResult(null)
    try {
      const result = await makeMatch(selectedPerson1.email, selectedPerson2.email, userEmail)
      setMatchResult(result); setCooldownRemaining(180)
      celebrationHaptic()
      if (onMatchComplete) onMatchComplete()
    } catch (err) {
      if (err.message?.includes('Cooldown')) {
        const m = err.message.match(/(\d+)m\s*(\d+)s/)
        if (m) setCooldownRemaining(parseInt(m[1]) * 60 + parseInt(m[2]))
      }
      setError(err.message)
    } finally { setMatching(false) }
  }

  const clearSelection = () => {
    mediumHaptic()
    setSelectedPerson1(null); setSelectedPerson2(null); setMatchResult(null); setError(null)
  }

  const cooldownMins = Math.floor(cooldownRemaining / 60)
  const cooldownSecs = cooldownRemaining % 60
  const canMatch = selectedPerson1 && selectedPerson2 && cooldownRemaining <= 0

  return (
    <div className="space-y-5">
      {/* ---- Match Result ---- */}
      <AnimatePresence>
        {matchResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
            className="card-elevated p-6 sm:p-8 text-center relative overflow-hidden shadow-cinematic"
          >
            <LottieAccent
              className="absolute top-2 left-2"
              size={76}
              opacity={0.3}
              variant="loading"
              entranceDelay={0.1}
              floatDistance={7}
              floatDuration={4.4}
              driftX={4}
              rotateRange={4}
            />
            <LottieAccent
              className="absolute bottom-1 right-1"
              size={64}
              opacity={0.24}
              variant="pulse"
              entranceDelay={0.2}
              floatDistance={6}
              floatDuration={5.8}
              driftX={-3}
            />

            {/* Confetti particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0.8],
                  y: [-20, -80, -120, -160],
                  x: [0, (Math.random() - 0.5) * 100],
                  rotate: [0, Math.random() * 360]
                }}
                transition={{ duration: 2, delay: i * 0.1, ease: 'easeOut' }}
                className="absolute left-1/2 bottom-1/2 w-2 h-2 rounded-full z-50"
                style={{ 
                  background: i % 3 === 0 ? '#620725' : i % 3 === 1 ? '#910D28' : '#B76E79',
                  pointerEvents: 'none'
                }}
              />
            ))}
            
            {/* Decorative corners */}
            <DoodleKey className="absolute top-3 left-3 opacity-[0.07]" size={40} />
            <DoodleLock className="absolute bottom-3 right-3 opacity-[0.07]" size={35} />

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative inline-block mb-4"
            >
              <HeartIcon className="text-wine mx-auto" size={48} filled />
              <div className="absolute inset-0 blur-xl bg-wine/40 rounded-full scale-150 glow-wine -z-10" />
            </motion.div>
            
            <h3 className="font-script text-3xl text-wine mb-1">Match Score</h3>
            <p className="text-5xl font-bold text-wine font-serif mb-2">
              {matchResult.score}%
            </p>
            <p className="text-ink/55 font-sans text-sm mb-1">
              {matchResult.person1_name} & {matchResult.person2_name}
            </p>
            {matchResult.points > 0 && (
              <p className="text-crimson font-sans text-sm font-bold mb-1">
                +{matchResult.points} point{matchResult.points > 1 ? 's' : ''} earned
              </p>
            )}
            <p className="text-ink/35 font-sans text-xs mb-5">
              Matched {matchResult.number_of_times_matched} time{matchResult.number_of_times_matched > 1 ? 's' : ''}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={clearSelection}
              className="btn-wine rounded-xl px-6 py-2.5 font-sans font-semibold text-sm"
            >
              Match Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-wine/5 border border-wine/10 rounded-organic p-4 text-wine text-sm font-sans text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Cooldown */}
      {cooldownRemaining > 0 && !matchResult && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-parchment-dark/30 border border-wine/8 rounded-organic p-4 flex items-center justify-center gap-2.5"
        >
          <Clock strokeWidth={1.5} className="w-4 h-4 text-wine/50" />
          <span className="text-wine/70 font-sans text-sm font-semibold">
            Cooldown: {cooldownMins}m {String(cooldownSecs).padStart(2, '0')}s
          </span>
        </motion.div>
      )}

      {/* ---- Search & Selection ---- */}
      {!matchResult && (
        <div className="card-elevated p-5 sm:p-7 space-y-5 relative overflow-hidden">
          <LottieAccent
            className="absolute top-1 right-1"
            size={72}
            opacity={0.2}
            variant="pulse"
            entranceDelay={0.15}
            floatDistance={6}
            floatDuration={6.2}
            driftX={5}
          />

          {/* Ledger-line search bar */}
          <div ref={searchRef} className="relative">
            <div className="relative">
              <Search strokeWidth={1.2} className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-wine/30" />
              <input
                type="text"
                placeholder={
                  !selectedPerson1
                    ? 'Search for a name…'
                    : !selectedPerson2
                    ? 'Now search the second person…'
                    : 'Both selected'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                disabled={selectedPerson1 && selectedPerson2}
                className="w-full input-ledger disabled:opacity-40 disabled:cursor-not-allowed"
              />
              {searching && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3.5 h-3.5 border-[1.5px] border-wine/20 border-t-wine rounded-full"
                  />
                </div>
              )}
            </div>

            <AnimatePresence>
              {showDropdown && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-30 top-full mt-2 w-full bg-cream rounded-organic shadow-editorial-lg border border-wine/8 max-h-56 overflow-y-auto"
                >
                  {suggestions.map((student, idx) => (
                    <motion.button
                      key={student.email}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => selectPerson(student)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-wine/[0.03] transition-colors first:rounded-t-organic last:rounded-b-organic text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-wine/8 flex items-center justify-center flex-shrink-0">
                        <User strokeWidth={1.2} size={14} className="text-wine" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-semibold text-ink truncate">{student.name}</p>
                        <p className="font-sans text-[0.65rem] text-ink/40 truncate">{formatBatchYear(student)}</p>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Two selection cards */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Person 1 */}
            <RomanticCard
              layout
              showHearts={!!selectedPerson1}
              className={`flex-1 rounded-organic border p-4 sm:p-5 text-center transition-all min-h-[110px] flex flex-col items-center justify-center ${
                selectedPerson1
                  ? 'border-wine/20 bg-wine/[0.03]'
                  : 'border-dashed border-wine/10 bg-parchment-light/50'
              }`}
            >
              {selectedPerson1 ? (
                <div className="relative w-full">
                  <button
                    onClick={() => setSelectedPerson1(null)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-wine/8 hover:bg-wine/15 flex items-center justify-center transition-colors"
                  >
                    <X strokeWidth={2} size={10} className="text-wine/60" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-wine/8 mx-auto mb-2 flex items-center justify-center">
                    <User strokeWidth={1.2} size={16} className="text-wine" />
                  </div>
                  <p className="font-sans text-sm font-semibold text-ink truncate">{selectedPerson1.name}</p>
                  <p className="font-sans text-[0.65rem] text-ink/40 mt-0.5">{formatBatchYear(selectedPerson1)}</p>
                </div>
              ) : (
                <div className="text-ink/20">
                  <DoodleLock className="mx-auto mb-1 opacity-40" size={28} />
                  <p className="font-sans text-xs">Person 1</p>
                </div>
              )}
            </RomanticCard>

            {/* Heart / X connector */}
            <div className="flex-shrink-0">
              {selectedPerson1 && selectedPerson2 ? (
                <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <HeartIcon className="text-wine" size={24} filled />
                </motion.div>
              ) : (
                <HeartIcon className="text-wine/15" size={20} />
              )}
            </div>

            {/* Person 2 */}
            <RomanticCard
              layout
              showHearts={!!selectedPerson2}
              className={`flex-1 rounded-organic border p-4 sm:p-5 text-center transition-all min-h-[110px] flex flex-col items-center justify-center ${
                selectedPerson2
                  ? 'border-crimson/20 bg-crimson/[0.03]'
                  : 'border-dashed border-wine/10 bg-parchment-light/50'
              }`}
            >
              {selectedPerson2 ? (
                <div className="relative w-full">
                  <button
                    onClick={() => setSelectedPerson2(null)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-wine/8 hover:bg-wine/15 flex items-center justify-center transition-colors"
                  >
                    <X strokeWidth={2} size={10} className="text-wine/60" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-crimson/8 mx-auto mb-2 flex items-center justify-center">
                    <User strokeWidth={1.2} size={16} className="text-crimson" />
                  </div>
                  <p className="font-sans text-sm font-semibold text-ink truncate">{selectedPerson2.name}</p>
                  <p className="font-sans text-[0.65rem] text-ink/40 mt-0.5">{formatBatchYear(selectedPerson2)}</p>
                </div>
              ) : (
                <div className="text-ink/20">
                  <DoodleKey className="mx-auto mb-1 opacity-40" size={28} />
                  <p className="font-sans text-xs">Person 2</p>
                </div>
              )}
            </RomanticCard>
          </div>

          {/* Match button */}
          <ShimmerButton
            onClick={handleMatch}
            disabled={!canMatch || matching}
            className={`w-full py-4 rounded-xl font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              canMatch
                ? 'btn-wine cursor-pointer'
                : 'bg-parchment-dark/30 text-ink/25 cursor-not-allowed'
            }`}
          >
            <HeartIcon className={canMatch ? 'text-cream' : 'text-ink/20'} size={18} filled={!!canMatch} />
            {matching
              ? 'Matching…'
              : cooldownRemaining > 0
              ? `Cooldown ${cooldownMins}:${String(cooldownSecs).padStart(2, '0')}`
              : !selectedPerson1 || !selectedPerson2
              ? 'Select two people to match'
              : 'Write this match into the Ledger'}
          </ShimmerButton>
        </div>
      )}

      {/* ---- Sticker-style CTA (replaces "Boring Day?") ---- */}
      <motion.div
        whileHover={{ rotate: -1, scale: 1.01 }}
        className="relative rounded-organic-lg overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(98,7,37,0.06) 0%, rgba(145,13,40,0.04) 100%)' }}
      >
        {/* "Sticker" tape strips */}
        <div className="absolute -top-0.5 left-1/4 w-16 h-3 bg-wine/[0.06] rounded-b-sm transform -rotate-2" />
        <div className="absolute -top-0.5 right-1/3 w-12 h-3 bg-wine/[0.05] rounded-b-sm transform rotate-1" />

        <div className="p-6 text-center relative">
          <LottieAccent
            className="absolute top-0 left-1/2 -translate-x-1/2"
            variant="birds"
            size={72}
            opacity={0.36}
            entranceDelay={0.1}
            floatDistance={8}
            floatDuration={6.8}
            driftX={3}
          />

          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-3"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#8D1038" opacity="0.45">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.div>
          <p className="font-script text-xl text-wine/80 mb-1">Feeling adventurous?</p>
          <p className="text-xs text-ink/40 font-sans leading-relaxed max-w-xs mx-auto">
            Pick two names, let Cupid's algorithm reveal their compatibility — and earn points for every entry in the ledger.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export { MatchFinder }
