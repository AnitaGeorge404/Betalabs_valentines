import { motion } from 'framer-motion'
import {
  Heart, User, Sparkles, Globe, Lock, Timer
} from 'lucide-react'
import { supabase } from '../lib/supabase'

function Profile({ user, onLogout }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    if (onLogout) onLogout()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-elegant p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-deep-crimson to-soft-red mx-auto mb-4 flex items-center justify-center">
            <User strokeWidth={1.2} size={40} className="text-white" />
          </div>
          <h2 className="font-script text-4xl text-deep-crimson mb-2">{user?.name || 'Student'}</h2>
          <p className="text-charcoal/60 font-sans">{user?.email || ''}</p>
          {user?.year && (
            <p className="text-charcoal/40 font-sans text-sm mt-1">
              Batch of {user.year} &middot; Roll #{user.rollno}
            </p>
          )}
        </div>

        {/* Best Match Notification */}
        <div className="bg-gradient-to-r from-deep-crimson/5 to-soft-red/5 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-deep-crimson/10 flex items-center justify-center flex-shrink-0">
              <Heart strokeWidth={1.2} fill="currentColor" className="w-6 h-6 text-soft-red" />
            </div>
            <div className="flex-1">
              <h4 className="font-serif text-lg text-deep-crimson mb-2">Your Best Match</h4>
              <p className="text-charcoal/70 font-sans text-sm mb-4">
                Your perfect match will be revealed at 11:00 PM today. Get ready for something special!
              </p>
              <div className="flex items-center gap-2 text-charcoal/60">
                <Timer strokeWidth={1.2} className="w-4 h-4" />
                <span className="font-sans text-sm">Coming soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Answers Summary */}
        {user?.answers && (
          <div className="border-t border-pink-shadow/20 pt-6 mb-6">
            <h4 className="font-serif text-xl text-deep-crimson mb-4">Your Quiz Answers</h4>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(user.answers).map(([qid, val]) => (
                <div key={qid} className="text-center bg-gradient-to-br from-deep-crimson/5 to-soft-red/5 rounded-xl p-2">
                  <p className="text-xs text-charcoal/50 font-sans">Q{qid}</p>
                  <p className="text-lg font-bold text-deep-crimson font-serif">{Number(val).toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="border-t border-pink-shadow/20 pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full bg-white border-2 border-pink-shadow/30 rounded-2xl py-3 font-sans font-semibold text-charcoal/70 hover:border-red-300 hover:text-red-500 transition-all"
          >
            Sign Out
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export { Profile }
