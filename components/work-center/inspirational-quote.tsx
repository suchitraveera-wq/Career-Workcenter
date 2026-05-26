'use client'

import { useEffect, useState } from 'react'
import { getQuoteOfTheDay, getNextRefreshTime } from '@/lib/quotes'
import { Card, CardContent } from '@/components/ui/card'
import { Quote, RefreshCw } from 'lucide-react'

export function InspirationalQuote() {
  const [quote, setQuote] = useState(getQuoteOfTheDay())
  const [nextRefresh, setNextRefresh] = useState<Date | null>(null)
  const [timeUntilRefresh, setTimeUntilRefresh] = useState('')

  useEffect(() => {
    // Update quote
    const updateQuote = () => {
      setQuote(getQuoteOfTheDay())
      setNextRefresh(getNextRefreshTime())
    }

    updateQuote()

    // Check every minute for quote refresh
    const interval = setInterval(updateQuote, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!nextRefresh) return

    const updateCountdown = () => {
      const now = new Date()
      const diff = nextRefresh.getTime() - now.getTime()
      
      if (diff <= 0) {
        setQuote(getQuoteOfTheDay())
        setNextRefresh(getNextRefreshTime())
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeUntilRefresh(`${hours}h ${minutes}m`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)
    return () => clearInterval(interval)
  }, [nextRefresh])

  return (
    <Card className="border-border/50 bg-gradient-to-br from-primary/5 via-card to-accent/5">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-lg font-medium leading-relaxed text-foreground text-pretty">
              &ldquo;{quote.quote}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{quote.author}</p>
                <p className="text-sm text-muted-foreground">{quote.role}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RefreshCw className="h-3 w-3" />
                <span>Refreshes in {timeUntilRefresh}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
