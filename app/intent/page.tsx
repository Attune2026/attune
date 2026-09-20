'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client'

const OPTIONS = [
  { emoji: '💬', label: 'Someone to talk to' },
  { emoji: '🤝', label: 'Friendship' },
  { emoji: '🫂', label: 'Companionship' },
  { emoji: '❤️', label: 'Dating' },
  { emoji: '💕', label: 'Serious relationship' },
  { emoji: '🧠', label: 'Share ideas' },
  { emoji: '😊', label: 'Social & fun' },
  { emoji: '🌱', label: 'See where it goes' },
]

export default function Intent() {
  const supabase = createClient()
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('profiles')
        .select('looking_for')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data?.looking_for) setSelected(data.looking_for)
    }
    load()
  }, [])

  async function handleContinue() {
    if (!userId || !selected) return
    setSaving(true)
    await supabase
      .from('profiles')
      .upsert({ user_id: userId, looking_for: selected }, { onConflict: 'user_id' })
    setSaving(false)
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-16 flex justify-center">
      <div className="w-full max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral to-gold mb-6" />
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2 tracking-tight">
          What are you looking for?
        </h1>
        <p className="text-ink/50 mb-8">Pick what fits right now — you can change this anytime.</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.label
            return (
              <button
                key={opt.label}
                onClick={() => setSelected(opt.label)}
                className={`text-left rounded-2xl p-4 border transition
                  ${isSelected
                    ? 'border-coral bg-gradient-to-br from-coral/10 to-gold/10 ring-2 ring-coral/40'
                    : 'border-black/5 bg-white hover:border-coral/30'}`}
              >
                <div className="text-2xl mb-1">{opt.emoji}</div>
                <div className="text-sm font-bold text-ink">{opt.label}</div>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected || saving}
          className="w-full bg-gradient-to-r from-coral to-coral-deep text-white font-bold rounded-2xl py-4
                     shadow-lg shadow-coral/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                     transition disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {saving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </main>
  )
}