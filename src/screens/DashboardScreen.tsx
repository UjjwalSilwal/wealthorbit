'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  Wallet,
  RefreshCw,
  Eye,
  Clock,
  ArrowLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StockChart } from '@/components/market/StockChart'
import { Watchlist } from '@/components/market/Watchlist'
import { NewsFeed } from '@/components/market/NewsFeed'
import { AnimatedSection } from '@/components/animations/AnimatedSection'
import TradingViewScreener from '@/components/tradingview/TradingViewScreener'

const stats = [
  {
    title: 'Total Portfolio',
    value: '$1,248,560',
    change: '+12.4%',
    positive: true,
    icon: Wallet,
  },
  {
    title: 'Today\'s Gain',
    value: '+$24,560',
    change: '+2.1%',
    positive: true,
    icon: TrendingUp,
  },
  {
    title: 'Total Assets',
    value: '42',
    change: '+3',
    positive: true,
    icon: Activity,
  },
  {
    title: 'Dividends',
    value: '$8,450',
    change: '+5.3%',
    positive: true,
    icon: DollarSign,
  },
]

export function DashboardScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState<'forex' | 'stock' | 'crypto' | 'index' | 'futures'>('stock')

  // Get country data from URL
  const countryName = searchParams.get('country') || ''
  const countrySymbol = searchParams.get('symbol') || 'SPX'
  const countryExchange = searchParams.get('exchange') || 'NASDAQ'

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleBack = () => {
    router.push('/markets')
  }

  // Handle symbol click - navigate to screener page with symbol
  const handleSymbolClick = (symbol: string) => {
    // Construct the full symbol with exchange if needed
    const fullSymbol = `${countryExchange}:${symbol}`
    router.push(`/screener?symbol=${encodeURIComponent(fullSymbol)}`)
  }

  // Handle "View Details" click on the screener widget items
  const handleViewDetails = (symbol: string) => {
    const fullSymbol = `${countryExchange}:${symbol}`
    router.push(`/screener?symbol=${encodeURIComponent(fullSymbol)}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Countries
            </Button>
          </div>
          <h1 className="text-3xl font-bold">
            {countryName || 'Dashboard'}
            {countrySymbol && (
              <span className="text-lg font-normal text-muted-foreground ml-3">
                ({countrySymbol} · {countryExchange})
              </span>
            )}
          </h1>
          <p className="text-muted-foreground">
            {countryName ? `Market overview for ${countryName}` : 'Welcome back, John! Here\'s your portfolio overview.'}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="relative"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>

      {/* TradingView Screener - Shows companies from the selected country */}
      <div className="mb-8">
        <Card className="overflow-hidden border border-border/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {countryName ? `${countryName} Market Screener` : 'Market Screener'}
            </CardTitle>
            <div className="flex gap-2">
              {['stock', 'forex', 'crypto', 'index', 'futures'].map((market) => (
                <Button
                  key={market}
                  variant={selectedMarket === market ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMarket(market as typeof selectedMarket)}
                >
                  {market.charAt(0).toUpperCase() + market.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TradingViewScreener
              market={selectedMarket}
              colorTheme="dark"
              height={500}
              showToolbar={true}
              symbol={countrySymbol}
              exchange={countryExchange}
              country={countryName}
              onSymbolClick={handleSymbolClick}  // Pass the click handler
            />
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <AnimatedSection key={stat.title} delay={index * 0.1}>
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant={stat.positive ? 'success' : 'destructive'}>
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-sm text-muted-foreground">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        ))}
      </div>

      {/* Chart and Watchlist */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {countryName ? `${countryName} Market Performance` : 'Portfolio Performance'}
              </CardTitle>
              <div className="flex gap-2">
                {['1D', '1W', '1M', '3M', '1Y'].map((time) => (
                  <Button
                    key={time}
                    variant={selectedTimeframe === time ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <StockChart height={300} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Watchlist />
        </div>
      </div>

      {/* News Feed */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {countryName ? `${countryName} Market News` : 'Market News'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NewsFeed limit={5} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Trade', icon: TrendingUp, gradient: 'from-blue-600 to-blue-400' },
                { label: 'Analyze', icon: BarChart3, gradient: 'from-purple-600 to-purple-400' },
                { label: 'Screener', icon: Eye, gradient: 'from-pink-600 to-pink-400' },
                { label: 'Watchlist', icon: Activity, gradient: 'from-indigo-600 to-indigo-400' },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-2"
                >
                  <div className={`p-3 rounded-full bg-gradient-to-r ${action.gradient}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}