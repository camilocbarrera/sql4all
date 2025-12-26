import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { LandingPage } from '@/components/landing'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/exercises')
  }

  return <LandingPage />
}
