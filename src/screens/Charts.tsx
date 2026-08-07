'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Zap, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  Globe,
  LineChart,
  Users,
  Award,
  Search,
  RefreshCw,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MarketTicker } from '@/components/market/MarketTicker'
import TradingViewWidget from '@/components/tradingview/TradingViewWidget'
import { AnimatedSection } from '@/components/animations/AnimatedSection'
import { ParticleBackground } from '@/components/animations/ParticleBackground'

const features = [
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Advanced charting tools and real-time market data with AI-powered insights.',
    gradient: 'from-blue-600 to-blue-400',
  },
  {
    icon: Shield,
    title: 'Smart Portfolio',
    description: 'AI-driven portfolio optimization and risk management strategies.',
    gradient: 'from-purple-600 to-purple-400',
  },
  {
    icon: Zap,
    title: 'Instant Execution',
    description: 'Lightning-fast trade execution with real-time market data streaming.',
    gradient: 'from-pink-600 to-pink-400',
  },
  {
    icon: BarChart3,
    title: 'Advanced Screener',
    description: 'Powerful stock screener with custom filters and AI recommendations.',
    gradient: 'from-indigo-600 to-indigo-400',
  },
]

const stats = [
  { label: 'Active Users', value: '100K+', icon: Users },
  { label: 'Market Coverage', value: '50+', icon: Globe },
  { label: 'Accuracy Rate', value: '96%', icon: Award },
  { label: 'Transactions', value: '$2.5B+', icon: LineChart },
]

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

export function ChartScreen() {
  const [selectedSymbol, setSelectedSymbol] = useState('NASDAQ:AAPL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInterval, setSelectedInterval] = useState('D')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredStocks = popularStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol)
    setSearchTerm('')
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Chart */}
      <section className={`relative flex items-center overflow-hidden transition-all duration-500 ${isFullscreen ? 'min-h-screen' : 'min-h-screen'}`}>
        <ParticleBackground />
        
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container relative mx-auto px-4 py-16 lg:py-32">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left Content - 2/5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Investing
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Smart Investing for
                <span className="block gradient-text">the Future</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Harness the power of AI to make smarter investment decisions. 
                Real-time analytics, advanced tools, and professional insights at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 flex-wrap">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <stat.icon className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Chart - 3/5 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-3 relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20" />
              
              <Card className={`relative bg-card rounded-2xl border border-border/50 backdrop-blur-sm overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50 rounded-2xl' : ''}`}>
                {/* Chart Controls */}
                <div className="p-4 border-b border-border/50 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
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
                              onClick={() => handleSymbolChange(`NASDAQ:${stock.symbol}`)}
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
                          onClick={() => handleSymbolChange(`NASDAQ:${stock.symbol}`)}
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

                {/* Chart */}
                <div className="relative" style={{ height: isFullscreen ? 'calc(100vh - 160px)' : '500px' }}>
                  <TradingViewWidget
                    symbol={selectedSymbol}
                    theme="dark"
                    interval={selectedInterval as any}
                    allowSymbolChange={true}
                    hideSideToolbar={false}
                    hideTopToolbar={false}
                    backgroundColor="#0F0F0F"
                    className="w-full h-full"
                  />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to
                <span className="block gradient-text">Succeed in Markets</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Professional-grade tools and AI-powered insights to help you make better investment decisions.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}