'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

// Update: Added 'prevState' as the first argument
export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Get data from the form
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 2. Ask Supabase to sign in
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    return { error: error.message }
  }

  // 3. If successful, refresh the page and go to dashboard
  revalidatePath('/', 'layout')
  redirect('/')
}