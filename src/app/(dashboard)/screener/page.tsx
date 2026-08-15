'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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
import TradingViewSymbol from '@/components/tradingview/TradingViewSymbol'
import TradingViewCompanyProfile from '@/components/tradingview/TradingViewCompanyProfile'
import TradingViewWidget from '@/components/tradingview/TradingViewWidget'
import TradingViewFundamental from '@/components/tradingview/TradingViewFundamental'
import TradingViewTechnical from '@/components/tradingview/TradingViewTechnical'

// Main Screener Page
const marketData = [
  { symbol: 'AAPL', exchange: 'NASDAQ', name: 'Apple Inc.', price: 198.45, change: 2.4, volume: '45.6M', marketCap: '3.1T' },
  { symbol: 'GOOGL', exchange: 'NASDAQ', name: 'Alphabet Inc.', price: 173.20, change: 1.8, volume: '28.3M', marketCap: '2.2T' },
  { symbol: 'MSFT', exchange: 'NASDAQ', name: 'Microsoft Corp.', price: 378.90, change: -0.3, volume: '32.1M', marketCap: '2.8T' },
  { symbol: 'AMZN', exchange: 'NASDAQ', name: 'Amazon.com Inc.', price: 186.50, change: 3.1, volume: '38.9M', marketCap: '1.9T' },
  { symbol: 'TSLA', exchange: 'NASDAQ', name: 'Tesla Inc.', price: 265.30, change: -1.2, volume: '52.4M', marketCap: '842B' },
  { symbol: 'META', exchange: 'NASDAQ', name: 'Meta Platforms', price: 365.80, change: 2.7, volume: '22.7M', marketCap: '938B' },
  { symbol: 'NVDA', exchange: 'NASDAQ', name: 'NVIDIA Corp.', price: 825.20, change: 4.5, volume: '41.2M', marketCap: '2.0T' },
  { symbol: 'JPM', exchange: 'NYSE', name: 'JPMorgan Chase', price: 159.40, change: 1.1, volume: '18.5M', marketCap: '467B' },
]

export default function ScreenerPage() {
  const searchParams = useSearchParams()
  const symbolFromUrl = searchParams.get('symbol')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'marketCap'>('change')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedStock, setSelectedStock] = useState(marketData[0])

  // Update selected stock if symbol is provided in URL
  useEffect(() => {
    if (symbolFromUrl) {
      // Try to find matching stock
      const matchedStock = marketData.find(
        stock => stock.symbol === symbolFromUrl || 
                 `${stock.exchange}:${stock.symbol}` === symbolFromUrl
      )
      
      if (matchedStock) {
        setSelectedStock(matchedStock)
        setSearchTerm('')
      } else {
        // If no match found, you could set a custom symbol for indices
        // For now, we'll keep the first item
        console.log(`No matching stock found for symbol: ${symbolFromUrl}`)
      }
    }
  }, [symbolFromUrl])

  const filteredData = marketData
    .filter(item => 
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1
      if (sortBy === 'price') return (a.price - b.price) * order
      if (sortBy === 'change') return (a.change - b.change) * order
      if (sortBy === 'volume') return (parseFloat(a.volume) - parseFloat(b.volume)) * order
      return 0
    })

  // Construct the full symbol with exchange
  const fullSymbol = `${selectedStock.exchange}:${selectedStock.symbol}`

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
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

      {/* Widget Showcase Section */}
      <div className="mb-8 space-y-4">
        {/* TradingView Symbol Chart */}
        <Card className="overflow-hidden border border-border/50 shadow-md">
          <CardContent className="p-4 sm:p-6 bg-card">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Selected Symbol Analysis
            </div>
            <TradingViewSymbol symbol={fullSymbol} />
          </CardContent>
        </Card>

        {/* Company Profile */}
        <Card className="overflow-hidden border border-border/50 shadow-md">
          <CardContent className="p-4 sm:p-6 bg-card">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company Profile - {selectedStock.symbol}
            </div>
            <TradingViewCompanyProfile 
              symbol={fullSymbol}
              height={350}
              colorTheme="light"
            />
          </CardContent>
        </Card>

        {/* Advanced TradingView Widget */}
        <Card className="overflow-hidden border border-border/50 shadow-md">
          <CardContent className="p-4 sm:p-6 bg-card">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Advanced Chart - {selectedStock.symbol}
            </div>
            <TradingViewWidget 
              symbol={fullSymbol}
              theme="dark"
              height={500}
              hideTopToolbar={false}
              hideSideToolbar={true}
              allowSymbolChange={true}
            />
          </CardContent>
        </Card>

        {/* Fundamentals & Technical Analysis - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Fundamentals Widget */}
          <Card className="overflow-hidden border border-border/50 shadow-md">
            <CardContent className="p-4 sm:p-6 bg-card">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Financial Fundamentals - {selectedStock.symbol}
              </div>
              <TradingViewFundamental 
                symbol={fullSymbol}
                theme="dark"
                displayMode="regular"
                height={550}
                isTransparent={false}
              />
            </CardContent>
          </Card>

          {/* Technical Analysis Widget */}
          <Card className="overflow-hidden border border-border/50 shadow-md">
            <CardContent className="p-4 sm:p-6 bg-card">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Technical Analysis - {selectedStock.symbol}
              </div>
              <TradingViewTechnical 
                symbol={fullSymbol}
                colorTheme="dark"
                height={550}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
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
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
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

      {/* Stock List */}
      <div className="space-y-3">
        {filteredData.map((item, index) => {
          const isSelected = selectedStock.symbol === item.symbol
          return (
            <AnimatedSection key={item.symbol} delay={index * 0.03}>
              <Card 
                onClick={() => setSelectedStock(item)}
                className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border ${
                  isSelected ? 'border-primary ring-1 ring-primary/50 bg-accent/40' : 'border-border/60'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-500 transition-colors" />
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {item.symbol}
                            {isSelected && (
                              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-normal">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{item.name}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-8">
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
                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                        Trade
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          )
        })}
      </div>
    </div>
  )
}