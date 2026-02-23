'use client' // <--- This is now a Client Component

import { useActionState } from 'react' // Uses React 19 hook
import { login } from './actions'

// Define the initial state of the form (no error)
const initialState = {
  error: '',
}

export default function LoginPage() {
  // state holds the return value from the server (e.g., the error message)
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enterprise Leave Portal
          </p>
        </div>

        {/* We use 'formAction' here, which comes from the hook */}
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="email@ihub-drishti.ai"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Show Error Message if it exists */}
          {state?.error && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
              {state.error}
            </div>
          )}

          <button
            disabled={isPending}
            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:bg-blue-300"
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}