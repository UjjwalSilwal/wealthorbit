'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Search,
  RefreshCw,
  Maximize2,
  Minimize2,
  Loader2,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MarketTicker } from '@/components/market/MarketTicker'
import { TradingViewWidget } from '@/components/tradingview'
import { ParticleBackground } from '@/components/animations/ParticleBackground'

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'JPM', name: 'JPMorgan Chase' },
]

const intervals = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1h', value: '60' },
  { label: '1D', value: 'D' },
  { label: '1W', value: 'W' },
  { label: '1M', value: 'M' },
]

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">Failed to load the chart. Please try again.</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      )
    }

    return this.props.children
  }
}

function ChartContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSymbol = searchParams?.get('symbol') || 'NASDAQ:AAPL'
  
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInterval, setSelectedInterval] = useState('D')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Update symbol from URL params
  useEffect(() => {
    const symbol = searchParams?.get('symbol')
    if (symbol) {
      setSelectedSymbol(symbol)
    }
  }, [searchParams])

  const filteredStocks = popularStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSymbolChange = (symbol: string) => {
    let formattedSymbol = symbol
    if (!symbol.includes(':')) {
      formattedSymbol = `NASDAQ:${symbol}`
    }
    setSelectedSymbol(formattedSymbol)
    setSearchTerm('')
    router.push(`/charts?symbol=${encodeURIComponent(formattedSymbol)}`, { scroll: false })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <section className={`relative flex items-center overflow-hidden transition-all duration-500 min-h-screen`}>
      <ParticleBackground />
      
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Live Charts
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Advanced Trading Charts
            </h1>
            <p className="text-muted-foreground">
              Real-time price action with professional trading tools
            </p>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20" />
            
            <Card className={`relative bg-card rounded-2xl border border-border/50 backdrop-blur-sm overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50 rounded-2xl' : ''}`}>
              {/* Chart Controls */}
              <div className="p-4 border-b border-border/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Display current symbol */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-sm">
                      {selectedSymbol}
                    </Badge>
                  </div>

                  {/* Symbol Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search stocks..."
                      className="pl-9 w-40 md:w-48 h-9 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border/50 rounded-lg shadow-lg overflow-hidden z-20 max-h-48 overflow-y-auto">
                        {filteredStocks.map((stock) => (
                          <button
                            key={stock.symbol}
                            className="w-full px-4 py-2 text-left hover:bg-accent transition-colors text-sm flex items-center justify-between"
                            onClick={() => handleSymbolChange(stock.symbol)}
                          >
                            <span className="font-medium">{stock.symbol}</span>
                            <span className="text-muted-foreground text-xs">{stock.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Symbol Buttons */}
                  <div className="flex gap-1 overflow-x-auto pb-1 max-w-[200px] md:max-w-none">
                    {popularStocks.slice(0, 5).map((stock) => (
                      <Button
                        key={stock.symbol}
                        variant={selectedSymbol === `NASDAQ:${stock.symbol}` ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs h-7 px-3 whitespace-nowrap"
                        onClick={() => handleSymbolChange(stock.symbol)}
                      >
                        {stock.symbol}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Interval Selector */}
                  <div className="flex gap-0.5">
                    {intervals.slice(0, 5).map((interval) => (
                      <Button
                        key={interval.value}
                        variant={selectedInterval === interval.value ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => setSelectedInterval(interval.value)}
                      >
                        {interval.label}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Chart - Wrapped in Error Boundary */}
              <ErrorBoundary>
                <div className="relative" style={{ height: isFullscreen ? 'calc(100vh - 160px)' : '600px' }}>
                  <TradingViewWidget
                    key={`${selectedSymbol}-${selectedInterval}`}
                    symbol={selectedSymbol}
                    theme="dark"
                    interval={selectedInterval as any}
                    className="w-full h-full"
                  />
                </div>
              </ErrorBoundary>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function ChartScreen() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[600px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <ChartContent />
      </Suspense>

      {/* Market Ticker */}
      <MarketTicker />

      <Footer />
    </div>
  )
}