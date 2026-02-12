import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { DoodleRose, DoodleDivider, DoodleCherub } from './Doodles'

/* Inline heart SVG */
const HeartIcon = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const ClockIcon = ({ className = '', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

function Profile({ user, onLogout }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    if (onLogout) onLogout()
  }

  return (
    <div className="space-y-5">
      <div className="card-elevated p-6 sm:p-8 relative">
        {/* Corner doodle */}
        <div className="absolute top-4 right-4 opacity-15 pointer-events-none">
          <DoodleRose size={36} />
        </div>

        {/* Avatar + name */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-wine mx-auto mb-3 flex items-center justify-center ring-4 ring-wine/10">
            <User strokeWidth={1} size={32} className="text-cream" />
          </div>
          <h2 className="font-script text-3xl text-wine mb-1">{user?.name || 'Student'}</h2>
          <p className="text-ink/40 font-sans text-xs">{user?.email || ''}</p>
          {user?.year && (
            <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
              {user.batch && (
                <span className="pill-wine">Batch {user.batch}</span>
              )}
              <span className="pill-wine">
                {user.year}
              </span>
              <span className="bg-wine/5 text-ink/50 font-sans text-[0.6rem] font-semibold px-2.5 py-1 rounded-full tracking-wide">
                Roll #{user.rollno}
              </span>
            </div>
          )}
        </div>

        <DoodleDivider className="mx-auto mb-5" />

        {/* Best Match Notification */}
        <div className="bg-cream border border-wine/8 rounded-organic p-5 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-wine/8 flex items-center justify-center flex-shrink-0 mt-0.5">
              <HeartIcon className="text-wine" size={18} />
            </div>
            <div className="flex-1">
              <h4 className="font-serif text-base text-wine mb-1">Your Best Match</h4>
              <p className="text-ink/50 font-sans text-xs leading-relaxed mb-3">
                Your perfect match will be revealed at 11:00 PM today. Get ready for something special!
              </p>
              <div className="flex items-center gap-1.5 text-ink/35">
                <ClockIcon size={12} />
                <span className="font-sans text-[0.65rem] tracking-wide">Coming soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Answers Summary */}
        {user?.answers && (
          <div className="border-t border-wine/6 pt-5 mb-5">
            <h4 className="font-serif text-lg text-wine mb-3">Your Quiz Answers</h4>
            <div className="grid grid-cols-5 gap-1.5">
              {Object.entries(user.answers).map(([qid, val]) => (
                <div key={qid} className="text-center bg-wine/[0.03] border border-wine/6 rounded-lg p-2">
                  <p className="text-[0.55rem] text-ink/35 font-sans tracking-wider mb-0.5">Q{qid}</p>
                  <p className="text-sm font-bold text-wine font-serif">{Number(val).toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="border-t border-wine/6 pt-5">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="btn-outline w-full text-xs"
          >
            Sign Out
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export { Profile }
