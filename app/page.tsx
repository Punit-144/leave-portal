import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  // 1. Check if user is logged in
  const { data: { user }, error } = await supabase.auth.getUser()

  // 2. If not logged in, kick them to the login page
  if (error || !user) {
    redirect('/login')
  }

  // 3. If logged in, show their info
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-gray-100 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Enterprise Leave Portal
            </h1>
          </div>
          
          <div className="p-6">
            <div className="mb-6 flex items-center gap-4 rounded-md bg-green-50 p-4 text-green-700 border border-green-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-2xl">
                ✅
              </div>
              <div>
                <p className="font-bold">Authentication Successful!</p>
                <p className="text-sm">You are securely logged in.</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Card 1: User Info */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 font-semibold text-gray-500">Current Session</h3>
                <p className="text-sm text-gray-600">Logged in as:</p>
                <p className="text-xl font-medium text-gray-900">{user.email}</p>
                <p className="mt-2 text-xs text-gray-400">User ID: {user.id}</p>
              </div>

              {/* Card 2: Next Steps */}
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <h3 className="mb-2 font-semibold text-gray-500">System Status</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Phase 1: Database (Connected)</li>
                  <li>Phase 2: Authentication (Verified)</li>
                  <li>Phase 3: Frontend Connection (In Progress)</li>
                </ul>
              </div>
            </div>

            <form action="/auth/signout" method="post" className="mt-8">
               <button className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
                 Sign Out (Test)
               </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}