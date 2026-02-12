import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Clock, TrendingUp } from 'lucide-react'
import { getCouplesLeaderboard, getUsersLeaderboard } from '../lib/api'
import { DoodleDivider } from './Doodles'

/* Inline SVG icons to match editorial theme */
const HeartIcon = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const TrophyIcon = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
)

const StarIcon = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const RANK_LABELS = ['I', 'II', 'III']

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('couples')
  const [couples, setCouples] = useState([])
  const [topUsers, setTopUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [nextUpdateIn, setNextUpdateIn] = useState(0)

  const fetchData = () => {
    setLoading(true)
    Promise.all([getCouplesLeaderboard(20), getUsersLeaderboard(20)])
      .then(([couplesRes, usersRes]) => {
        setCouples(couplesRes.data || couplesRes)
        setTopUsers(usersRes.data || usersRes)
        setNextUpdateIn(Math.max(couplesRes.next_update_in || 0, usersRes.next_update_in || 0))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (nextUpdateIn <= 0) return
    const interval = setInterval(() => {
      setNextUpdateIn(prev => { if (prev <= 1) { clearInterval(interval); return 0 } return prev - 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [nextUpdateIn])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-serif text-lg text-wine/60"
        >
          Loading leaderboard…
        </motion.div>
      </div>
    )
  }

  const top3Couples = couples.slice(0, 3)
  const restCouples = couples.slice(3)

  return (
    <div className="space-y-5">
      {/* Tab Switcher */}
      <div className="bg-cream/80 rounded-organic p-1 flex gap-1 border border-wine/6">
        {[
          { id: 'couples', label: 'Top Couples', Icon: HeartIcon },
          { id: 'users', label: 'Top Matchers', Icon: StarIcon },
        ].map(({ id, label, Icon }) => (
          <motion.button
            key={id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-2.5 rounded-[0.9rem] font-sans font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 ${
              activeTab === id
                ? 'bg-wine text-cream shadow-editorial'
                : 'text-ink/45 hover:text-ink/65'
            }`}
          >
            <Icon size={13} className={activeTab === id ? 'text-cream' : 'text-ink/35'} />
            {label}
          </motion.button>
        ))}
      </div>

      {/* Next update */}
      <div className="flex items-center justify-center gap-1.5 text-ink/35 font-sans text-[0.65rem] tracking-wide">
        <Clock strokeWidth={1.5} className="w-3 h-3" />
        {nextUpdateIn > 0 ? (
          <span>Next update in {Math.floor(nextUpdateIn / 60)}:{String(nextUpdateIn % 60).padStart(2, '0')}</span>
        ) : (
          <button onClick={fetchData} className="text-wine font-semibold hover:underline">Refresh now</button>
        )}
      </div>

      {/* ---- Couples ---- */}
      {activeTab === 'couples' && (
        <>
          <div className="card-elevated p-5 sm:p-7">
            <div className="text-center mb-6">
              <TrophyIcon className="text-wine mx-auto mb-2" size={28} />
              <h3 className="font-serif text-2xl text-wine mb-1">Most Matched Couples</h3>
              <p className="text-ink/40 font-sans text-xs">Couples matched the most by the community</p>
            </div>

            {top3Couples.length === 0 ? (
              <p className="text-center text-ink/40 font-sans py-8 text-sm">
                No matches yet. Be the first to write an entry.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {top3Couples.map((couple, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(98,7,37,0.1)' }}
                    className="bg-cream border border-wine/10 rounded-organic p-5 text-center relative"
                  >
                    {/* Rank numeral */}
                    <span className="absolute top-3 left-4 font-serif text-[0.65rem] text-wine/30 tracking-wider">
                      {RANK_LABELS[index]}
                    </span>

                    <div className="w-10 h-10 rounded-full bg-wine/8 mx-auto mb-3 flex items-center justify-center">
                      <HeartIcon className="text-wine" size={18} />
                    </div>
                    <div className="mb-3">
                      <h4 className="font-script text-base text-wine">{couple.person1_name}</h4>
                      <span className="text-wine/25 text-xs">&</span>
                      <h4 className="font-script text-base text-wine">{couple.person2_name}</h4>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-ink/40 font-sans">Matched</span>
                        <span className="text-ink font-bold font-sans">{couple.number_of_times_matched}×</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/40 font-sans">Score</span>
                        <span className="text-ink font-bold font-sans">{couple.score}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {restCouples.length > 0 && (
            <div className="card-elevated p-5 sm:p-7">
              <div className="space-y-2">
                {restCouples.map((couple, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="bg-wine/[0.02] border border-wine/6 rounded-organic p-3.5 sm:p-4 flex items-center gap-2.5"
                  >
                    <span className="text-ink/25 font-bold font-sans text-sm w-7">#{index + 4}</span>
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-wine/6 flex items-center justify-center flex-shrink-0">
                        <User strokeWidth={1.2} size={12} className="text-wine" />
                      </div>
                      <span className="font-serif text-xs text-ink truncate">{couple.person1_name}</span>
                    </div>
                    <HeartIcon className="text-wine/25 flex-shrink-0" size={12} />
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                      <span className="font-serif text-xs text-ink truncate">{couple.person2_name}</span>
                      <div className="w-7 h-7 rounded-full bg-crimson/6 flex items-center justify-center flex-shrink-0">
                        <User strokeWidth={1.2} size={12} className="text-crimson" />
                      </div>
                    </div>
                    <div className="ml-1 text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-ink/40">
                        <TrendingUp strokeWidth={1.2} className="w-3.5 h-3.5" />
                        <span className="font-sans text-xs font-semibold">{couple.number_of_times_matched}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ---- Users ---- */}
      {activeTab === 'users' && (
        <div className="card-elevated p-5 sm:p-7">
          <div className="text-center mb-6">
            <StarIcon className="text-wine mx-auto mb-2" size={24} />
            <h3 className="font-serif text-2xl text-wine mb-1">Top Matchers</h3>
            <p className="text-ink/40 font-sans text-xs">Users with the highest matching score</p>
          </div>

          {topUsers.length === 0 ? (
            <p className="text-center text-ink/40 font-sans py-8 text-sm">
              No scores yet. Start matching to earn points!
            </p>
          ) : (
            <div className="space-y-2">
              {topUsers.filter(u => (u.score || 0) > 0).map((user, index) => {
                const isPodium = index < 3

                return (
                  <motion.div
                    key={user.email}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ y: -2 }}
                    className={`rounded-organic p-3.5 sm:p-4 flex items-center gap-3 ${
                      isPodium
                        ? 'bg-cream border border-wine/12'
                        : 'bg-wine/[0.02] border border-wine/6'
                    }`}
                  >
                    <span className={`font-serif text-sm w-7 ${isPodium ? 'text-wine font-bold' : 'text-ink/25'}`}>
                      {RANK_LABELS[index] || `#${index + 1}`}
                    </span>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isPodium ? 'bg-wine' : 'bg-wine/8'
                    }`}>
                      <User strokeWidth={1.2} size={14} className={isPodium ? 'text-cream' : 'text-wine'} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-serif truncate text-sm ${isPodium ? 'text-wine' : 'text-ink'}`}>
                        {user.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <StarIcon className="text-wine/50" size={13} />
                      <span className="font-sans font-bold text-wine text-sm">
                        {Math.round(user.score || 0)}
                      </span>
                      <span className="font-sans text-ink/30 text-[0.6rem]">pts</span>
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
