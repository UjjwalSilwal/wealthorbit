'use client'

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
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MarketTicker } from '@/components/market/MarketTicker'
import { MarketData } from '@/components/tradingview/MarketData'
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

export function HomeScreen() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <ParticleBackground />
        
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container relative mx-auto px-4 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Investing
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Smart Investing for
                <span className="block gradient-text">the Future</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
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
              <div className="flex items-center gap-8 mt-8 flex-wrap">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <stat.icon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20" />
              <MarketData className="max-h-150 relative bg-card rounded-2xl border border-border/50 backdrop-blur-sm" />
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