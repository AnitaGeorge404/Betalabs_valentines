import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Search, User, Sparkles, X, Clock } from 'lucide-react'
import { searchUsers, makeMatch, getCooldown } from '../lib/api'

function formatBatchYear(user) {
  if (!user?.year) return ''
  const batch = user.batch ? `Batch ${user.batch}` : ''
  const yr = user.year ? `${user.year}` : ''
  return [batch, yr].filter(Boolean).join(' | ')
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

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

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }
    setSearching(true)
    searchUsers(debouncedQuery)
      .then((data) => {
        const filtered = data.filter(
          (s) =>
            s.email !== selectedPerson1?.email &&
            s.email !== selectedPerson2?.email
        )
        setSuggestions(filtered)
        setShowDropdown(filtered.length > 0)
      })
      .catch(() => setSuggestions([]))
      .finally(() => setSearching(false))
  }, [debouncedQuery, selectedPerson1?.email, selectedPerson2?.email])

  // Check cooldown on mount
  useEffect(() => {
    if (!userEmail) return
    getCooldown(userEmail).then((res) => {
      if (res.cooldown) setCooldownRemaining(res.remaining_seconds)
    }).catch(() => {})
  }, [userEmail])

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return
    const interval = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [cooldownRemaining])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectPerson = useCallback((student) => {
    if (!selectedPerson1) {
      setSelectedPerson1(student)
    } else if (!selectedPerson2) {
      setSelectedPerson2(student)
    }
    setSearchQuery('')
    setSuggestions([])
    setShowDropdown(false)
  }, [selectedPerson1, selectedPerson2])

  const handleMatch = async () => {
    if (!selectedPerson1 || !selectedPerson2) return
    if (cooldownRemaining > 0) return
    setMatching(true)
    setError(null)
    setMatchResult(null)
    try {
      const result = await makeMatch(selectedPerson1.email, selectedPerson2.email, userEmail)
      setMatchResult(result)
      setCooldownRemaining(180)
      if (onMatchComplete) onMatchComplete()
    } catch (err) {
      if (err.message?.includes('Cooldown')) {
        const match = err.message.match(/(\d+)m\s*(\d+)s/)
        if (match) setCooldownRemaining(parseInt(match[1]) * 60 + parseInt(match[2]))
      }
      setError(err.message)
    } finally {
      setMatching(false)
    }
  }

  const clearSelection = () => {
    setSelectedPerson1(null)
    setSelectedPerson2(null)
    setMatchResult(null)
    setError(null)
  }

  const cooldownMins = Math.floor(cooldownRemaining / 60)
  const cooldownSecs = cooldownRemaining % 60
  const canMatch = selectedPerson1 && selectedPerson2 && cooldownRemaining <= 0

  return (
    <div className="space-y-6">
      {/* Match Result */}
      <AnimatePresence>
        {matchResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gradient-to-br from-deep-crimson/10 to-soft-red/10 rounded-3xl shadow-elegant p-6 sm:p-8 text-center border-2 border-soft-red/30"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart strokeWidth={0} fill="currentColor" className="w-12 h-12 text-deep-crimson mx-auto mb-4" />
            </motion.div>
            <h3 className="font-script text-3xl text-deep-crimson mb-2">Match Score</h3>
            <p className="text-5xl font-bold text-deep-crimson font-serif mb-2">
              {matchResult.score}%
            </p>
            <p className="text-charcoal/70 font-sans text-sm mb-1">
              {matchResult.person1_name} & {matchResult.person2_name}
            </p>
            {matchResult.points > 0 && (
              <p className="text-soft-red font-sans text-sm font-bold mb-1">
                +{matchResult.points} point{matchResult.points > 1 ? 's' : ''} earned!
              </p>
            )}
            <p className="text-charcoal/50 font-sans text-xs mb-4">
              Matched {matchResult.number_of_times_matched} time{matchResult.number_of_times_matched > 1 ? 's' : ''}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearSelection}
              className="bg-deep-crimson text-white rounded-xl px-6 py-2 font-sans font-semibold shadow-elegant"
            >
              Match Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm font-sans text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Cooldown Banner */}
      {cooldownRemaining > 0 && !matchResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-center gap-3"
        >
          <Clock strokeWidth={1.5} className="w-5 h-5 text-amber-600" />
          <span className="text-amber-700 font-sans text-sm font-semibold">
            Cooldown: {cooldownMins}m {String(cooldownSecs).padStart(2, '0')}s
          </span>
        </motion.div>
      )}

      {/* Search Bar + Selection Boxes */}
      {!matchResult && (
        <div className="bg-white rounded-3xl shadow-elegant p-5 sm:p-6 space-y-5">
          {/* Search */}
          <div ref={searchRef} className="relative">
            <div className="relative">
              <Search strokeWidth={1.2} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <input
                type="text"
                placeholder={
                  !selectedPerson1
                    ? 'Search for Person 1...'
                    : !selectedPerson2
                    ? 'Search for Person 2...'
                    : 'Both selected!'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                disabled={selectedPerson1 && selectedPerson2}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-pink-shadow/20 rounded-2xl font-sans focus:outline-none focus:border-soft-red transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {searching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-soft-red/30 border-t-soft-red rounded-full"
                  />
                </div>
              )}
            </div>

            {/* Dropdown Suggestions */}
            <AnimatePresence>
              {showDropdown && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-30 top-full mt-2 w-full bg-white rounded-2xl shadow-lg border border-pink-shadow/20 max-h-64 overflow-y-auto"
                >
                  {suggestions.map((student) => (
                    <button
                      key={student.email}
                      onClick={() => selectPerson(student)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-deep-crimson/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-pink-shadow/20 flex items-center justify-center flex-shrink-0">
                        <User strokeWidth={1.2} size={16} className="text-charcoal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-semibold text-charcoal truncate">
                          {student.name}
                        </p>
                        <p className="font-sans text-xs text-charcoal/50 truncate">
                          {formatBatchYear(student)}
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Two Selection Boxes with X between */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Person 1 Box */}
            <motion.div
              layout
              className={`flex-1 rounded-2xl border-2 p-4 sm:p-5 text-center transition-all min-h-[120px] flex flex-col items-center justify-center ${
                selectedPerson1
                  ? 'border-deep-crimson/40 bg-gradient-to-br from-deep-crimson/5 to-soft-red/5'
                  : 'border-dashed border-pink-shadow/30 bg-gray-50/50'
              }`}
            >
              {selectedPerson1 ? (
                <div className="relative w-full">
                  <button
                    onClick={() => setSelectedPerson1(null)}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-charcoal/10 hover:bg-charcoal/20 flex items-center justify-center transition-colors"
                  >
                    <X strokeWidth={2} size={12} className="text-charcoal/60" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-deep-crimson/10 mx-auto mb-2 flex items-center justify-center">
                    <User strokeWidth={1.2} size={18} className="text-deep-crimson" />
                  </div>
                  <p className="font-sans text-sm font-semibold text-charcoal truncate">
                    {selectedPerson1.name}
                  </p>
                  <p className="font-sans text-xs text-charcoal/50 mt-0.5">
                    {formatBatchYear(selectedPerson1)}
                  </p>
                </div>
              ) : (
                <div className="text-charcoal/30">
                  <User strokeWidth={1} size={28} className="mx-auto mb-1" />
                  <p className="font-sans text-xs">Person 1</p>
                </div>
              )}
            </motion.div>

            {/* X / Heart between */}
            <div className="flex-shrink-0">
              {selectedPerson1 && selectedPerson2 ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart strokeWidth={0} fill="currentColor" className="w-8 h-8 text-deep-crimson" />
                </motion.div>
              ) : (
                <X strokeWidth={1.5} className="w-6 h-6 text-charcoal/20" />
              )}
            </div>

            {/* Person 2 Box */}
            <motion.div
              layout
              className={`flex-1 rounded-2xl border-2 p-4 sm:p-5 text-center transition-all min-h-[120px] flex flex-col items-center justify-center ${
                selectedPerson2
                  ? 'border-soft-red/40 bg-gradient-to-br from-soft-red/5 to-pink-shadow/10'
                  : 'border-dashed border-pink-shadow/30 bg-gray-50/50'
              }`}
            >
              {selectedPerson2 ? (
                <div className="relative w-full">
                  <button
                    onClick={() => setSelectedPerson2(null)}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-charcoal/10 hover:bg-charcoal/20 flex items-center justify-center transition-colors"
                  >
                    <X strokeWidth={2} size={12} className="text-charcoal/60" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-soft-red/10 mx-auto mb-2 flex items-center justify-center">
                    <User strokeWidth={1.2} size={18} className="text-soft-red" />
                  </div>
                  <p className="font-sans text-sm font-semibold text-charcoal truncate">
                    {selectedPerson2.name}
                  </p>
                  <p className="font-sans text-xs text-charcoal/50 mt-0.5">
                    {formatBatchYear(selectedPerson2)}
                  </p>
                </div>
              ) : (
                <div className="text-charcoal/30">
                  <User strokeWidth={1} size={28} className="mx-auto mb-1" />
                  <p className="font-sans text-xs">Person 2</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Match Button */}
          <motion.button
            whileHover={canMatch ? { scale: 1.03 } : {}}
            whileTap={canMatch ? { scale: 0.97 } : {}}
            onClick={handleMatch}
            disabled={!canMatch || matching}
            className={`w-full py-4 rounded-2xl font-sans font-bold text-base flex items-center justify-center gap-2 transition-all ${
              canMatch
                ? 'bg-gradient-to-r from-deep-crimson to-soft-red text-white shadow-elegant cursor-pointer'
                : 'bg-gray-100 text-charcoal/30 cursor-not-allowed'
            }`}
          >
            <Heart strokeWidth={1.5} fill={canMatch ? 'currentColor' : 'none'} className="w-5 h-5" />
            {matching
              ? 'Matching...'
              : cooldownRemaining > 0
              ? `Cooldown ${cooldownMins}:${String(cooldownSecs).padStart(2, '0')}`
              : !selectedPerson1 || !selectedPerson2
              ? 'Select two people to match'
              : 'Match!'}
          </motion.button>
        </div>
      )}

      {/* Fun Message */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-deep-crimson/5 to-soft-red/5 rounded-3xl p-6 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ y: 100, opacity: 0 }}
              animate={{
                y: -100,
                opacity: [0, 0.2, 0],
                x: [0, 20, -20, 0]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 1.5
              }}
              style={{ left: `${20 + i * 30}%` }}
            >
              <Heart className="text-soft-red" size={20} fill="currentColor" opacity={0.2} />
            </motion.div>
          ))}
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles strokeWidth={1.2} className="w-6 h-6 sm:w-8 sm:h-8 text-soft-red mx-auto mb-3" />
        </motion.div>
        <p className="font-script text-xl sm:text-2xl text-deep-crimson mb-2">Boring day?</p>
        <p className="text-xs sm:text-sm text-charcoal/60 font-sans">Create some matches and spice things up!</p>
      </motion.div>
    </div>
  )
}

export { MatchFinder }
