'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const mockNews = [
  {
    id: '1',
    title: 'Fed Signals Rate Cuts Amid Cooling Inflation',
    source: 'Bloomberg',
    time: '2 hours ago',
    sentiment: 'positive',
    symbol: 'SPY',
  },
  {
    id: '2',
    title: 'NVIDIA AI Chip Demand Surpasses Expectations',
    source: 'Reuters',
    time: '4 hours ago',
    sentiment: 'positive',
    symbol: 'NVDA',
  },
  {
    id: '3',
    title: 'Oil Prices Decline on Supply Concerns',
    source: 'CNBC',
    time: '6 hours ago',
    sentiment: 'negative',
    symbol: 'XLE',
  },
  {
    id: '4',
    title: 'Apple to Announce New AI Features at WWDC',
    source: 'TechCrunch',
    time: '8 hours ago',
    sentiment: 'neutral',
    symbol: 'AAPL',
  },
  {
    id: '5',
    title: 'Bitcoin Surges Past $60,000 on ETF Inflows',
    source: 'CoinDesk',
    time: '12 hours ago',
    sentiment: 'positive',
    symbol: 'BTC',
  },
]

interface NewsFeedProps {
  limit?: number
}

export function NewsFeed({ limit = 5 }: NewsFeedProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const displayedNews = mockNews.slice(0, limit)

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'negative':
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-yellow-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'negative':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    }
  }

  return (
    <div className="space-y-3">
      {displayedNews.map((news, index) => (
        <motion.div
          key={news.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
          onClick={() => setExpandedId(expandedId === news.id ? null : news.id)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={getSentimentColor(news.sentiment)}>
                  {getSentimentIcon(news.sentiment)}
                  <span className="ml-1 capitalize">{news.sentiment}</span>
                </Badge>
                {news.symbol && (
                  <Badge variant="outline" className="text-xs">
                    {news.symbol}
                  </Badge>
                )}
              </div>
              <p className="font-medium group-hover:text-primary transition-colors">
                {news.title}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{news.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {news.time}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}