'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client'

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-paper px-6">
      <form onSubmit={handleLogIn} className="w-full max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral to-gold mb-6" />
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2 tracking-tight">Welcome back</h1>
        <p className="text-ink/50 mb-8">Log in to keep the conversation going.</p>

        <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 p-7 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-ink/50 mb-2">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF7F1] border border-black/5 rounded-2xl px-4 py-3.5 text-ink
                         focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-ink/50 mb-2">Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAF7F1] border border-black/5 rounded-2xl px-4 py-3.5 text-ink
                         focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral/40 transition"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-700 bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-coral to-coral-deep text-white font-bold rounded-2xl py-4
                       shadow-lg shadow-coral/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                       transition disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </div>

        <p className="text-center text-sm text-ink/50 mt-6">
          New to Attune?{' '}
          <a href="/signup" className="text-coral font-semibold">Create account</a>
        </p>
      </form>
    </main>
  )
}