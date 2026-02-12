import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCouplesLeaderboard, getUsersLeaderboard } from '../lib/api'
import { DoodleDivider, WaxSeal, InkSplatter, SparkleCluster, VintageStamp } from './Doodles'
import { RomanticCard, staggerVariants, staggerItemVariants } from './RomanticEffects'
import { LottieAccent } from './LottieAccent'
import { lightHaptic, mediumHaptic } from '../lib/haptics'

/* Inline SVG icons to match editorial theme */
const HeartIcon = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
          { id: 'users', label: 'Top Matchers', Icon: HeartIcon },
        ].map(({ id, label, Icon }) => (
          <motion.button
            key={id}
            whileTap={{ scale: 0.97 }}
            onClick={() => { lightHaptic(); setActiveTab(id); }}
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
      <div className="flex items-center justify-center gap-1.5 text-ink/45 font-sans text-xs tracking-wide">
        <HeartIcon size={11} className="text-wine/40" />
        {nextUpdateIn > 0 ? (
          <span>Next update in {Math.floor(nextUpdateIn / 60)}:{String(nextUpdateIn % 60).padStart(2, '0')}</span>
        ) : (
          <button onClick={() => { mediumHaptic(); fetchData() }} className="text-wine font-semibold hover:underline">Refresh now</button>
        )}
      </div>

      {/* ---- Couples ---- */}
      {activeTab === 'couples' && (
        <>
          <div className="card-elevated p-5 sm:p-7 shadow-cinematic">
            <div className="text-center mb-6 relative">
              <LottieAccent
                className="absolute top-1 right-2"
                size={68}
                opacity={0.38}
                entranceDelay={0.1}
                floatDistance={7}
                floatDuration={5.6}
                driftX={4}
                rotateRange={4}
                variant="birds"
              />

              <motion.div
                animate={{ 
                  y: [-2, 2, -2],
                  rotate: [-3, 3, -3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative inline-block"
              >
                <HeartIcon className="text-wine mx-auto mb-2" size={28} />
                <div className="absolute inset-0 blur-xl bg-wine/20 rounded-full scale-150" />
              </motion.div>
              <h3 className="font-serif text-[2rem] sm:text-4xl text-wine mb-1 text-reveal">Most Matched Couples</h3>
              <p className="text-ink/50 font-sans text-sm">Couples loved most by the community</p>
            </div>

            {top3Couples.length === 0 ? (
              <div className="text-center py-6 relative">
                <LottieAccent
                  className="mx-auto"
                  variant="enamored"
                  size={90}
                  opacity={0.5}
                  floatDistance={7}
                  floatDuration={5.4}
                />
                <p className="text-center text-ink/40 font-sans pt-2 text-sm">
                  No matches yet. Be the first to write an entry.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {top3Couples.map((couple, index) => (
                <RomanticCard
                  key={index}
                  showHearts={index === 0}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ boxShadow: '0 12px 40px rgba(98,7,37,0.1)' }}
                    className="bg-cream border border-wine/10 rounded-organic p-5 text-center relative vintage-paper"
                  >
                    {/* Wax seal for #1 */}
                    {index === 0 && (
                      <div className="absolute -top-4 -right-4 wax-seal-float">
                        <WaxSeal size={44} />
                      </div>
                    )}
                    {/* Sparkles for top 3 */}
                    {index < 3 && (
                      <SparkleCluster className="absolute top-2 right-2" size={20} />
                    )}
                    {/* Rank numeral */}
                    <span className="absolute top-3 left-4 font-serif text-[0.65rem] text-wine/30 tracking-wider">
                      {RANK_LABELS[index]}
                    </span>

                    <div className="w-10 h-10 rounded-full bg-wine/8 mx-auto mb-3 flex items-center justify-center">
                      <HeartIcon className="text-wine" size={18} />
                    </div>
                    <div className="mb-3">
                      <h4 className="font-serif text-lg sm:text-xl text-wine leading-tight">{couple.person1_name}</h4>
                      <span className="text-wine/35 text-sm">&</span>
                      <h4 className="font-serif text-lg sm:text-xl text-wine leading-tight">{couple.person2_name}</h4>
                    </div>
                    <div className="text-sm">
                      <span className="text-ink/55 font-sans">Matched </span>
                      <span className="text-wine font-bold font-sans">{couple.number_of_times_matched}×</span>
                    </div>
                  </RomanticCard>
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
                    className="bg-wine/[0.02] border border-wine/6 rounded-organic p-4 sm:p-4.5 flex items-center gap-2.5"
                  >
                    <span className="text-ink/35 font-bold font-sans text-sm w-8">#{index + 4}</span>
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="font-serif text-sm sm:text-base text-ink truncate">{couple.person1_name}</span>
                    </div>
                    <HeartIcon className="text-wine/25 flex-shrink-0" size={12} />
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                      <span className="font-serif text-sm sm:text-base text-ink truncate">{couple.person2_name}</span>
                    </div>
                    <div className="ml-1 text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-ink/40">
                        <HeartIcon className="text-wine/45" size={12} />
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

      {/* ---- Users ---- */}
      {activeTab === 'users' && (
        <div className="card-elevated p-5 sm:p-7">
          <div className="text-center mb-6">
            <HeartIcon className="text-wine mx-auto mb-2" size={24} />
            <h3 className="font-serif text-[2rem] sm:text-4xl text-wine mb-1">Top Matchers</h3>
            <p className="text-ink/50 font-sans text-sm">Most active matchmakers in the ledger</p>
          </div>

          {topUsers.length === 0 ? (
            <div className="text-center py-6 relative">
              <LottieAccent
                className="mx-auto"
                variant="loading"
                size={84}
                opacity={0.78}
                float={false}
              />
              <p className="text-center text-ink/40 font-sans pt-2 text-sm">
                No entries yet. Start matching to appear here!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {topUsers.map((user, index) => {
                const isPodium = index < 3

                return (
                  <motion.div
                    key={user.email}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ y: -2 }}
                    className={`rounded-organic p-4 sm:p-4.5 flex items-center gap-3 ${
                      isPodium
                        ? 'bg-cream border border-wine/12'
                        : 'bg-wine/[0.02] border border-wine/6'
                    }`}
                  >
                    <span className={`font-serif text-base w-8 ${isPodium ? 'text-wine font-bold' : 'text-ink/25'}`}>
                      {RANK_LABELS[index] || `#${index + 1}`}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className={`font-serif truncate text-base sm:text-lg ${isPodium ? 'text-wine' : 'text-ink'}`}>
                        {user.name}
                      </p>
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
