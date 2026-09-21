'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../utils/supabase/client'

type Profile = {
  user_id: string
  full_name: string | null
  bio: string | null
  looking_for: string | null
  interests: string | null
}

const GRADIENTS = [
  'from-coral to-gold',
  'from-[#77546C] to-[#3F2C39]',
  'from-[#6E8259] to-[#3D4A30]',
  'from-[#454F5F] to-[#2C333F]',
]

export default function Discover() {
  const supabase = createClient()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('profiles')
        .select('user_id, full_name, bio, looking_for, interests')
        .neq('user_id', user.id)

      setProfiles((data as Profile[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center bg-paper text-ink">Loading...</main>
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral to-gold mb-6" />
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2 tracking-tight">
          Online now
        </h1>
        <p className="text-ink/50 mb-8">People matching what you're looking for.</p>

        {profiles.length === 0 && (
          <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 p-8 text-center text-ink/50">
            No one else has joined yet — invite a friend to test with!
          </div>
        )}

        <div className="space-y-4">
          {profiles.map((p, i) => {
            const name = p.full_name?.trim() || 'Someone new'
            const initial = name[0]?.toUpperCase() || '?'
            const gradient = GRADIENTS[i % GRADIENTS.length]

            return (
              <div
                key={p.user_id}
                className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 p-5 flex gap-4"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-serif text-xl font-semibold shrink-0`}>
                  {initial}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <span className="font-bold text-ink truncate">{name}</span>
                  </div>

                  {p.looking_for && (
                    <p className="text-xs font-bold text-coral mb-1">{p.looking_for}</p>
                  )}

                  {p.bio && (
                    <p className="text-sm text-ink/60 line-clamp-2 mb-1">{p.bio}</p>
                  )}

                  {p.interests && (
                    <p className="text-xs text-ink/40">{p.interests}</p>
                  )}
                </div>

                <button className="self-center shrink-0 bg-ink text-white text-xs font-bold rounded-full px-4 py-2">
                  Say hi
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}