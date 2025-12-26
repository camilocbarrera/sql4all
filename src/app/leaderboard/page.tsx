'use client'

import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { Trophy, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useLeaderboard } from '@/hooks/use-leaderboard'
import { LeaderboardTable } from '@/components/leaderboard'
import { Button, Card, CardContent, Skeleton } from '@/components/ui'
import { formatDistanceToNow } from '@/lib/utils'

export default function LeaderboardPage() {
  const { user } = useUser()
  const { data, isLoading, refetch, isFetching } = useLeaderboard()

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header - Compact inline */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  Ranking
                </h1>
                {data?.updatedAt && (
                  <p className="text-xs text-muted-foreground/60">
                    {formatDistanceToNow(new Date(data.updatedAt))}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Leaderboard */}
          <Card className="border-border/40">
            <CardContent className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <LeaderboardTable 
                  entries={data?.leaderboard || []} 
                  currentUserId={user?.id}
                />
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground/50">
            <span>{data?.leaderboard?.length || 0} participantes</span>
            <Link 
              href="/exercises" 
              className="text-primary/70 hover:text-primary transition-colors"
            >
              Practicar →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

