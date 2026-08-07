'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter,
  ArrowUpDown,
  Star,
  Clock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/animations/AnimatedSection'

const marketData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 198.45, change: 2.4, volume: '45.6M', marketCap: '3.1T' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 173.20, change: 1.8, volume: '28.3M', marketCap: '2.2T' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: -0.3, volume: '32.1M', marketCap: '2.8T' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.50, change: 3.1, volume: '38.9M', marketCap: '1.9T' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 265.30, change: -1.2, volume: '52.4M', marketCap: '842B' },
  { symbol: 'META', name: 'Meta Platforms', price: 365.80, change: 2.7, volume: '22.7M', marketCap: '938B' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 825.20, change: 4.5, volume: '41.2M', marketCap: '2.0T' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 159.40, change: 1.1, volume: '18.5M', marketCap: '467B' },
]

export default function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'marketCap'>('change')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredData = marketData
    .filter(item => 
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1
      if (sortBy === 'price') return (a.price - b.price) * order
      if (sortBy === 'change') return (a.change - b.change) * order
      if (sortBy === 'volume') return parseFloat(a.volume) - parseFloat(b.volume) * order
      return 0
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Markets</h1>
          <p className="text-muted-foreground">Real-time market data and analysis</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['price', 'change', 'volume'] as const).map((field) => (
            <Button
              key={field}
              variant={sortBy === field ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                if (sortBy === field) {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy(field)
                  setSortOrder('desc')
                }
              }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredData.map((item, index) => (
          <AnimatedSection key={item.symbol} delay={index * 0.03}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-500 transition-colors" />
                      <div>
                        <div className="font-semibold">{item.symbol}</div>
                        <div className="text-sm text-muted-foreground">{item.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="font-semibold">${item.price.toFixed(2)}</div>
                      <div className={`text-sm ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </div>
                    </div>
                    <div className="text-right hidden md:block">
                      <div className="text-sm text-muted-foreground">Volume</div>
                      <div className="font-medium">{item.volume}</div>
                    </div>
                    <div className="text-right hidden lg:block">
                      <div className="text-sm text-muted-foreground">Market Cap</div>
                      <div className="font-medium">{item.marketCap}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Trade
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}