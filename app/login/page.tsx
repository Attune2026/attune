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
    <main className="min-h-screen flex items-center justify-center bg-[#FCFAF6] px-6">
      <form onSubmit={handleLogIn} className="w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-[#171B24] mb-2">Welcome back</h1>
        <p className="text-[#6B7280] mb-6">Log in to keep the conversation going.</p>

        <label className="block text-sm font-semibold text-[#454F5F] mb-1">Email</label>
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#E9E2D6] rounded-xl px-4 py-3 mb-4"
        />

        <label className="block text-sm font-semibold text-[#454F5F] mb-1">Password</label>
        <input
          type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#E9E2D6] rounded-xl px-4 py-3 mb-4"
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit" disabled={loading}
          className="w-full bg-[#E1634A] text-white font-bold rounded-2xl py-3.5"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </main>
  )
}