import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Heart, Search, User, Sparkles, X, Filter
} from 'lucide-react'
import { getAllUsers, makeMatch } from '../lib/api'

function MatchFinder({ userEmail }) {
  const [students, setStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPerson1, setSelectedPerson1] = useState(null)
  const [selectedPerson2, setSelectedPerson2] = useState(null)
  const [matchResult, setMatchResult] = useState(null)
  const [matching, setMatching] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAllUsers()
      .then(setStudents)
      .catch((err) => setError(err.message))
  }, [])

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleMatch = async () => {
    if (!selectedPerson1 || !selectedPerson2) return
    setMatching(true)
    setError(null)
    setMatchResult(null)
    try {
      const result = await makeMatch(selectedPerson1.email, selectedPerson2.email, userEmail)
      setMatchResult(result)
    } catch (err) {
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

  return (
    <div className="space-y-6">
      {/* Match Result Modal */}
      {matchResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm font-sans text-center">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-3xl shadow-elegant p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search strokeWidth={1.2} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-pink-shadow/20 rounded-2xl font-sans focus:outline-none focus:border-soft-red transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white border-2 border-pink-shadow/20 rounded-2xl p-3 hover:border-soft-red transition-all"
          >
            <Filter strokeWidth={1.2} className="w-5 h-5 text-charcoal" />
          </motion.button>
        </div>

        {/* Selected Persons */}
        {(selectedPerson1 || selectedPerson2) && !matchResult && (
          <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-gradient-to-r from-deep-crimson/5 to-soft-red/5 rounded-2xl">
            {selectedPerson1 && (
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-deep-crimson/10 flex items-center justify-center">
                  <User strokeWidth={1.2} size={16} className="text-deep-crimson" />
                </div>
                <span className="font-sans text-sm font-semibold text-charcoal">{selectedPerson1.name}</span>
                <button onClick={() => setSelectedPerson1(null)}>
                  <X strokeWidth={1.2} size={16} className="text-charcoal/40 hover:text-charcoal" />
                </button>
              </div>
            )}

            {selectedPerson1 && selectedPerson2 && (
              <Heart strokeWidth={1.2} fill="currentColor" className="w-5 h-5 text-soft-red" />
            )}

            {selectedPerson2 && (
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-soft-red/10 flex items-center justify-center">
                  <User strokeWidth={1.2} size={16} className="text-soft-red" />
                </div>
                <span className="font-sans text-sm font-semibold text-charcoal">{selectedPerson2.name}</span>
                <button onClick={() => setSelectedPerson2(null)}>
                  <X strokeWidth={1.2} size={16} className="text-charcoal/40 hover:text-charcoal" />
                </button>
              </div>
            )}

            {selectedPerson1 && selectedPerson2 && (
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: "0 15px 40px rgba(220, 20, 60, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 10px 30px rgba(220, 20, 60, 0.3)",
                    "0 15px 40px rgba(220, 20, 60, 0.4)",
                    "0 10px 30px rgba(220, 20, 60, 0.3)"
                  ]
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity },
                  boxShadow: { duration: 2, repeat: Infinity }
                }}
                onClick={handleMatch}
                disabled={matching}
                className="ml-auto bg-deep-crimson text-white rounded-xl px-6 py-2 font-sans font-semibold shadow-elegant flex items-center gap-2 disabled:opacity-50"
              >
                <Heart strokeWidth={1.2} fill="currentColor" className="w-4 h-4" />
                {matching ? 'Matching...' : 'Match!'}
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Students List */}
      {!matchResult && (
        <div className="bg-white rounded-3xl shadow-elegant p-4 sm:p-6">
          <h3 className="font-serif text-lg sm:text-xl text-deep-crimson mb-4">
            Select Students
          </h3>
          {filteredStudents.length === 0 ? (
            <p className="text-charcoal/50 font-sans text-sm text-center py-8">
              {students.length === 0 ? 'Loading students...' : 'No students found'}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 max-h-96 overflow-y-auto pr-2">
              {filteredStudents.map((student, index) => {
                const isSelected =
                  selectedPerson1?.email === student.email ||
                  selectedPerson2?.email === student.email

                return (
                  <motion.button
                    key={student.email}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 15px 35px rgba(255, 182, 193, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (isSelected) return
                      if (!selectedPerson1) {
                        setSelectedPerson1(student)
                      } else if (!selectedPerson2) {
                        setSelectedPerson2(student)
                      }
                    }}
                    disabled={isSelected}
                    className={`p-3 sm:p-4 rounded-2xl border-2 transition-all font-sans text-xs sm:text-sm relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-deep-crimson/10 to-soft-red/10 border-soft-red'
                        : 'border-pink-shadow/20 hover:border-soft-red bg-white'
                    } disabled:cursor-not-allowed`}
                  >
                    {isSelected && (
                      <motion.div
                        className="absolute top-1 right-1"
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-3 h-3 text-soft-red" fill="currentColor" />
                      </motion.div>
                    )}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-shadow/20 mx-auto mb-2 flex items-center justify-center">
                      <User strokeWidth={1.2} size={16} className="text-charcoal sm:w-5 sm:h-5" />
                    </div>
                    <p className="text-charcoal font-semibold truncate text-xs sm:text-sm">{student.name}</p>
                  </motion.button>
                )
              })}
            </div>
          )}
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
