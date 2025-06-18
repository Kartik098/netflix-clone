'use client'

import { redirect } from 'next/navigation'

export async function checkSessionOrRedirect() {
  const res = await fetch('/api/auth/session')
  const session = await res.json()

  if (!session?.user) {
    redirect('/auth')
  }
}