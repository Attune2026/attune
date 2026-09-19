import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FCFAF6] px-6">
      <div className="text-center">
        <p className="text-2xl font-semibold text-[#171B24] mb-2">You're logged in 🎉</p>
        <p className="text-[#6B7280]">{user.email}</p>
      </div>
    </main>
  )
}