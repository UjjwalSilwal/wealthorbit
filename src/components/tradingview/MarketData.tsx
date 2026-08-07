'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Loader2 } from 'lucide-react'

// TypeScript declaration for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tv-market-data': {
        'symbol-sectors'?: string
        children?: React.ReactNode
      }
    }
  }
}

interface MarketDataProps {
  className?: string
}

export function MarketData({ className = '' }: MarketDataProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    setIsLoading(true)
    setError(null)

    try {
      // Clear any existing widgets
      const existingWidget = container.querySelector('tv-market-data')
      if (existingWidget) {
        existingWidget.remove()
      }

      // Load TradingView widget script
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://widgets.tradingview-widget.com/w/en/tv-market-data.js'
      script.async = true
      
      script.onload = () => {
        setIsLoading(false)
      }

      script.onerror = () => {
        setError('Failed to load market data widget')
        setIsLoading(false)
      }

      container.appendChild(script)

      // Create the widget element
      const widgetElement = document.createElement('tv-market-data')
      const symbolSectors = JSON.stringify([
        {
          sectionName: "Indices",
          symbols: [
            "FOREXCOM:SPXUSD",
            "FOREXCOM:NSXUSD",
            "FOREXCOM:DJI",
            "INDEX:NKY",
            "INDEX:DEU40",
            "FOREXCOM:UKXGBP"
          ]
        },
        {
          sectionName: "Futures",
          symbols: [
            "BMFBOVESPA:ISP1!",
            "BMFBOVESPA:EUR1!",
            "CMCMARKETS:GOLD",
            "TVC:USOIL",
            "BMFBOVESPA:CCM1!"
          ]
        },
        {
          sectionName: "Bonds",
          symbols: [
            "EUREX:FGBL1!",
            "EUREX:FBTP1!",
            "EUREX:FGBM1!"
          ]
        },
        {
          sectionName: "Forex",
          symbols: [
            "FX:EURUSD",
            "FX:GBPUSD",
            "FX:USDJPY",
            "FX:USDCHF",
            "FX:AUDUSD",
            "FX:USDCAD"
          ]
        }
      ])
      
      widgetElement.setAttribute('symbol-sectors', symbolSectors)
      container.appendChild(widgetElement)

      // Check if widget loaded after a delay
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
        }
      }, 5000)

      return () => {
        clearTimeout(timeout)
        if (container) {
          const scriptToRemove = container.querySelector('script')
          if (scriptToRemove) {
            scriptToRemove.remove()
          }
          const widget = container.querySelector('tv-market-data')
          if (widget) {
            widget.remove()
          }
        }
      }
    } catch (err) {
      setError('Failed to initialize market data')
      setIsLoading(false)
    }
  }, [isLoading])

  return (
    <Card className={`p-6 rounded-2xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Market Overview</h3>
            <p className="text-xs text-muted-foreground">Real-time data from global markets</p>
          </div>
        </div>
        <Badge variant="success" className="animate-pulse rounded-full px-4 py-1.5 text-xs font-medium shadow-lg shadow-green-500/20">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </Badge>
      </div>
      
      <div ref={containerRef} className="relative min-h-[420px] w-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading market data...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center gap-3 text-center p-4">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}