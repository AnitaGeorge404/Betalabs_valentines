import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Heart, Trophy, User, Sparkles, Crown, Flame,
  Award, TrendingUp, Medal, Star
} from 'lucide-react'
import { getCouplesLeaderboard, getUsersLeaderboard } from '../lib/api'

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('couples') // couples | users
  const [couples, setCouples] = useState([])
  const [topUsers, setTopUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getCouplesLeaderboard(20),
      getUsersLeaderboard(20),
    ])
      .then(([couplesData, usersData]) => {
        setCouples(couplesData)
        setTopUsers(usersData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-deep-crimson font-serif text-xl"
        >
          Loading leaderboard...
        </motion.div>
      </div>
    )
  }

  const top3Couples = couples.slice(0, 3)
  const restCouples = couples.slice(3)

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="bg-white rounded-2xl shadow-elegant p-1.5 flex gap-1.5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveTab('couples')}
          className={`flex-1 py-3 rounded-xl font-sans font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'couples'
              ? 'bg-deep-crimson text-white shadow-elegant'
              : 'text-charcoal/60 hover:text-charcoal'
          }`}
        >
          <Heart strokeWidth={1.5} className="w-4 h-4" />
          Top Couples
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 rounded-xl font-sans font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'users'
              ? 'bg-deep-crimson text-white shadow-elegant'
              : 'text-charcoal/60 hover:text-charcoal'
          }`}
        >
          <Star strokeWidth={1.5} className="w-4 h-4" />
          Top Matchers
        </motion.button>
      </div>

      {/* Couples Leaderboard */}
      {activeTab === 'couples' && (
        <>
          <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <Trophy strokeWidth={1.2} className="w-10 h-10 sm:w-12 sm:h-12 text-deep-crimson mx-auto mb-3" />
              </motion.div>
              <h3 className="font-serif text-2xl sm:text-3xl text-deep-crimson mb-2">Most Matched Couples</h3>
              <p className="text-charcoal/60 font-sans text-xs sm:text-sm">Couples matched the most by the community</p>
            </div>

            {top3Couples.length === 0 ? (
              <p className="text-center text-charcoal/50 font-sans py-8">
                No matches yet. Be the first to create one!
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {top3Couples.map((couple, index) => {
                  const borderColors = ['border-rose-400', 'border-rose-300', 'border-pink-300']
                  const icons = [Crown, Award, Medal]
                  const Icon = icons[index] || Medal

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(255, 182, 193, 0.4)" }}
                      className={`bg-white rounded-2xl border-4 ${borderColors[index]} p-6 text-center relative overflow-hidden`}
                    >
                      {index === 0 && (
                        <motion.div
                          className="absolute top-2 right-2"
                          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="w-5 h-5 text-rose-400" fill="currentColor" />
                        </motion.div>
                      )}
                      <motion.div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-crimson to-soft-red mx-auto mb-4 flex items-center justify-center"
                        animate={index === 0 ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                      </motion.div>
                      <div className="mb-4">
                        <h4 className="font-script text-lg text-deep-crimson">{couple.person1_name}</h4>
                        <Heart strokeWidth={1.2} fill="currentColor" className="w-4 h-4 text-soft-red mx-auto my-1" />
                        <h4 className="font-script text-lg text-deep-crimson">{couple.person2_name}</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-charcoal/60 font-sans text-xs sm:text-sm">Times Matched</span>
                          <span className="text-charcoal font-bold text-sm sm:text-base">{couple.number_of_times_matched}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal/60 font-sans text-xs sm:text-sm">Score</span>
                          <span className="text-charcoal font-bold text-sm sm:text-base">{couple.score}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {restCouples.length > 0 && (
            <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8">
              <div className="space-y-3">
                {restCouples.map((couple, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-deep-crimson/5 to-soft-red/5 rounded-2xl p-4 sm:p-5 flex items-center gap-3"
                  >
                    <span className="text-charcoal/40 font-bold font-sans text-lg w-8">#{index + 4}</span>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-deep-crimson/10 flex items-center justify-center flex-shrink-0">
                        <User strokeWidth={1.2} size={16} className="text-deep-crimson" />
                      </div>
                      <span className="font-serif text-sm text-charcoal truncate">{couple.person1_name}</span>
                    </div>
                    <Heart strokeWidth={1.2} fill="currentColor" className="w-4 h-4 text-soft-red flex-shrink-0" />
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <span className="font-serif text-sm text-charcoal truncate">{couple.person2_name}</span>
                      <div className="w-9 h-9 rounded-full bg-soft-red/10 flex items-center justify-center flex-shrink-0">
                        <User strokeWidth={1.2} size={16} className="text-soft-red" />
                      </div>
                    </div>
                    <div className="ml-1 text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-charcoal/60">
                        <TrendingUp strokeWidth={1.2} className="w-4 h-4" />
                        <span className="font-sans text-sm font-semibold">{couple.number_of_times_matched}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Users Leaderboard (Top Matchers by Score) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <Flame strokeWidth={1.2} className="w-10 h-10 sm:w-12 sm:h-12 text-deep-crimson mx-auto mb-3" />
            </motion.div>
            <h3 className="font-serif text-2xl sm:text-3xl text-deep-crimson mb-2">Top Matchers</h3>
            <p className="text-charcoal/60 font-sans text-xs sm:text-sm">Users with the highest matching score</p>
          </div>

          {topUsers.length === 0 ? (
            <p className="text-center text-charcoal/50 font-sans py-8">
              No scores yet. Start matching to earn points!
            </p>
          ) : (
            <div className="space-y-3">
              {topUsers.filter(u => (u.score || 0) > 0).map((user, index) => {
                const podiumColors = ['border-rose-400', 'border-rose-300', 'border-pink-300']
                const podiumIcons = [Crown, Award, Medal]
                const isPodium = index < 3
                const Icon = podiumIcons[index] || User

                return (
                  <motion.div
                    key={user.email}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`rounded-2xl p-4 sm:p-5 flex items-center gap-4 ${
                      isPodium
                        ? `bg-white border-3 ${podiumColors[index]} border-2`
                        : 'bg-gradient-to-r from-deep-crimson/5 to-soft-red/5'
                    }`}
                  >
                    <span className={`font-bold font-sans text-lg w-8 ${
                      isPodium ? 'text-deep-crimson' : 'text-charcoal/40'
                    }`}>
                      #{index + 1}
                    </span>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isPodium
                        ? 'bg-gradient-to-br from-deep-crimson to-soft-red'
                        : 'bg-deep-crimson/10'
                    }`}>
                      {isPodium ? (
                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                      ) : (
                        <User strokeWidth={1.2} size={18} className="text-deep-crimson" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-serif truncate ${
                        isPodium ? 'text-deep-crimson text-lg' : 'text-charcoal text-base'
                      }`}>
                        {user.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Star strokeWidth={1.5} className="w-4 h-4 text-soft-red" fill="currentColor" />
                      <span className="font-sans font-bold text-deep-crimson text-lg">
                        {Math.round(user.score || 0)}
                      </span>
                      <span className="font-sans text-charcoal/50 text-xs">pts</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { Leaderboard }
