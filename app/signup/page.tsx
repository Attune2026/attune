'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else setDone(true)
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FCFAF6] px-6">
        <p className="text-center text-[#171B24] text-lg">
          Check your email to confirm your account, then log in.
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FCFAF6] px-6">
      <form onSubmit={handleSignUp} className="w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-[#171B24] mb-2">Create your account</h1>
        <p className="text-[#6B7280] mb-6">Takes less than a minute.</p>

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
          {loading ? 'Creating account...' : 'Continue'}
        </button>
      </form>
    </main>
  )
}