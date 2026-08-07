'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Loader2 } from 'lucide-react'

interface MarketDataProps {
  className?: string
  onSymbolSelect?: (symbol: string) => void
}

const SYMBOL_SECTORS = JSON.stringify([
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

export function MarketData({ className = '', onSymbolSelect }: MarketDataProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)

  // Extract symbol from URL safely
  const extractSymbolFromUrl = (url: string): string | null => {
    try {
      const matchPath = url.match(/\/symbols\/([^\/\?]+)/)
      if (matchPath && matchPath[1]) {
        return matchPath[1].split('?')[0].replace(/-/g, ':')
      }

      const urlObj = new URL(url)
      const symbolParam = urlObj.searchParams.get('symbol')
      if (symbolParam) {
        return symbolParam.replace(/-/g, ':')
      }
      return null
    } catch {
      return null
    }
  }

  // Navigate to chart
  const navigateToChart = (symbol: string) => {
    if (!symbol || !isMountedRef.current) return
    const formattedSymbol = symbol.replace(/-/g, ':')

    if (onSymbolSelect) {
      onSymbolSelect(formattedSymbol)
    } else {
      router.push(`/charts?symbol=${encodeURIComponent(formattedSymbol)}`)
    }
  }

  useEffect(() => {
    isMountedRef.current = true
    let isCleanedUp = false

    // Load TradingView script globally if not already present
    const SCRIPT_ID = 'tv-market-data-script'
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null

    const handleScriptLoad = () => {
      if (!isCleanedUp && isMountedRef.current) {
        setIsLoading(false)
      }
    }

    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'module'
      script.src = 'https://widgets.tradingview-widget.com/w/en/tv-market-data.js'
      script.async = true
      script.onload = handleScriptLoad
      script.onerror = () => {
        if (!isCleanedUp && isMountedRef.current) {
          setError('Failed to load market data widget')
          setIsLoading(false)
        }
      }
      document.head.appendChild(script)
    } else {
      // Script already exists
      setIsLoading(false)
    }

    // Intercept document click safely
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const anchor = target.closest('a')

      if (anchor && anchor.href) {
        const href = anchor.href
        if (href.includes('tradingview.com/symbols/') || href.includes('tradingview.com/chart/')) {
          event.preventDefault()
          event.stopPropagation()
          event.stopImmediatePropagation()

          const symbol = extractSymbolFromUrl(href)
          if (symbol) navigateToChart(symbol)
        }
      }
    }

    // Intercept window.open without leaking references
    const originalOpen = window.open
    window.open = function (url?: string | URL, target?: string, features?: string) {
      if (url && typeof url === 'string' && url.includes('tradingview.com')) {
        const symbol = extractSymbolFromUrl(url)
        if (symbol) {
          navigateToChart(symbol)
          return null
        }
      }
      return originalOpen ? originalOpen.call(window, url, target, features) : null
    }

    document.addEventListener('click', handleDocumentClick, true)

    return () => {
      isCleanedUp = true
      isMountedRef.current = false
      document.removeEventListener('click', handleDocumentClick, true)
      window.open = originalOpen

      // NOTE: We intentionally DO NOT manipulate `containerRef.current.innerHTML` here.
      // Allowing React to manage DOM removal naturally avoids the `NotFoundError: removeChild` exception.
    }
  }, [router, onSymbolSelect])

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
            <p className="text-xs text-muted-foreground">Click any symbol to view chart</p>
          </div>
        </div>
        <Badge variant="success" className="animate-pulse rounded-full px-4 py-1.5 text-xs font-medium shadow-lg shadow-green-500/20">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </Badge>
      </div>

      <div ref={containerRef} className="relative min-h-[420px] w-full rounded-xl overflow-hidden">
        {/* Render custom element declaratively in JSX so React tracks its DOM node correctly */}
        {!error && (
          <tv-market-data symbol-sectors={SYMBOL_SECTORS} style={{ width: '100%', height: '100%' }} />
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading market data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl z-10">
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