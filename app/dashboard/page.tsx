import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-gold mx-auto mb-6 flex items-center justify-center text-white text-2xl">
          🎉
        </div>
        <p className="font-serif text-3xl font-semibold text-ink mb-2">You're logged in</p>
        <p className="text-ink/50">{user.email}</p>

        <a href="/profile" className="inline-block mt-8 bg-ink text-white font-bold rounded-2xl px-6 py-3.5">
          Go to your profile
        </a>

        <form action={signOut} className="mt-4">
          <button type="submit" className="text-sm text-ink/40 font-semibold underline">
            Log out
          </button>
        </form>
      </div>
    </main>
  )
}