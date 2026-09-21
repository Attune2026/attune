'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../utils/supabase/client'

export default function Profile() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [lookingFor, setLookingFor] = useState('')
  const [interests, setInterests] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data) {
        setFullName(data.full_name || '')
        setBio(data.bio || '')
        setLookingFor(data.looking_for || '')
        setInterests(data.interests || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    if (!userId) return
    setSaving(true)
    setSaved(false)

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        full_name: fullName,
        bio,
        looking_for: lookingFor,
        interests,
      }, { onConflict: 'user_id' })

    setSaving(false)
    if (!error) setSaved(true)
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center bg-paper text-ink">Loading...</main>
  }

  if (!userId) {
    return <main className="min-h-screen flex items-center justify-center bg-paper text-ink">Please log in first.</main>
  }

  const initial = fullName.trim() ? fullName.trim()[0].toUpperCase() : '?'

  return (
    <main className="min-h-screen bg-paper px-6 py-16 flex justify-center">
      <div className="w-full max-w-md">

        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-gold flex items-center justify-center text-white font-serif text-2xl font-semibold shadow-lg shadow-coral/20">
            {initial}
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink tracking-tight">Your profile</h1>
            <p className="text-ink/50 text-sm">Photos & prompts, coming next</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 p-7 space-y-5">

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-ink/50 mb-2">
              Full name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#FAF7F1] border border-black/5 rounded-2xl px-4 py-3.5 text-ink placeholder:text-ink/30
                         focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-ink/50 mb-2">
              About me
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-[#FAF7F1] border border-black/5 rounded-2xl px-4 py-3.5 text-ink placeholder:text-ink/30 resize-none
                         focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-ink/50 mb-2">
              Looking for
            </label>
            <input
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              placeholder="Dating, Friendship, Someone to talk to..."
              className="w-full bg-[#FAF7F1] border border-black/5 rounded-2xl px-4 py-3.5 text-ink placeholder:text-ink/30
                         focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-ink/50 mb-2">
              Interests
            </label>
            <input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Travel, Reading, Hiking..."
              className="w-full bg-[#FAF7F1] border border-black/5 rounded-2xl px-4 py-3.5 text-ink placeholder:text-ink/30
                         focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral/40 transition"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-coral to-coral-deep text-white font-bold rounded-2xl py-4
                       shadow-lg shadow-coral/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                       transition disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>

          {saved && (
            <p className="text-center text-sm font-semibold text-green-700 bg-green-50 rounded-xl py-2.5">
              ✓ Saved
            </p>
          )}
        </div>
      </div>
    </main>
  )
}