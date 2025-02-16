'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'

export function Profile() {
  const { user, signOut, isLoading } = useAuth()

  // Add debugging console log
  console.log('Profile Component:', { user, isLoading })

  // Handle loading state
  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full animate-pulse">
        <div className="h-8 w-8 rounded-full bg-muted" />
      </Button>
    )
  }

  // If no user, show login button or return null
  if (!user) {
    console.log('No user found in Profile component')
    return null
  }

  const avatarUrl = user.user_metadata?.picture || user.user_metadata?.avatar_url

  return (
    <div className="relative z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-8 w-8 p-0 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background hover:bg-accent overflow-hidden"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={user.user_metadata?.full_name || 'Profile picture'}
                width={32}
                height={32}
                className="rounded-full"
                priority
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mt-1" align="end" sideOffset={5} forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 focus:bg-red-50 dark:focus:bg-red-950"
            onClick={() => signOut()}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 