'use client'

import React, { useEffect, useRef, memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface TradingViewScreenerProps {
  market?: string
  showToolbar?: boolean
  defaultColumn?: string
  defaultScreen?: string
  colorTheme?: 'light' | 'dark'
  locale?: string
  width?: string | number
  height?: string | number
  className?: string
  symbol?: string
  exchange?: string
  country?: string
  onSymbolClick?: (symbol: string) => void
}

// Map country names to TradingView market identifiers
const countryToMarketMap: Record<string, string> = {
  'United States': 'us',
  'China': 'china',
  'Japan': 'japan',
  'Germany': 'germany',
  'India': 'india',
  'United Kingdom': 'uk',
  'France': 'france',
  'Italy': 'italy',
  'Brazil': 'brazil',
  'Canada': 'canada',
  'Russia': 'russia',
  'Mexico': 'mexico',
  'South Korea': 'korea',
  'Australia': 'australia',
  'Spain': 'spain',
  'Indonesia': 'indonesia',
  'Turkey': 'turkey',
  'Saudi Arabia': 'saudi',
  'Netherlands': 'netherlands',
  'Switzerland': 'switzerland',
  'Poland': 'poland',
  'Argentina': 'argentina',
  'Belgium': 'belgium',
  'Sweden': 'sweden',
  'Ireland': 'ireland',
  'Austria': 'austria',
  'Singapore': 'singapore',
  'Israel': 'israel',
  'Norway': 'norway',
  'United Arab Emirates': 'uae',
  'Thailand': 'thailand',
  'Bangladesh': 'bangladesh',
  'Malaysia': 'malaysia',
  'Vietnam': 'vietnam',
  'South Africa': 'south_africa',
  'Hong Kong': 'hong_kong',
  'Denmark': 'denmark',
  'Philippines': 'philippines',
  'Egypt': 'egypt',
  'Chile': 'chile',
  'Finland': 'finland',
  'Pakistan': 'pakistan',
  'Colombia': 'colombia',
}

function TradingViewScreener({
  market = 'stock',
  showToolbar = true,
  defaultColumn = 'overview',
  defaultScreen = 'most_capitalized',
  colorTheme = 'dark',
  locale = 'en',
  width = '100%',
  height = 550,
  className = '',
  symbol = '',
  exchange = '',
  country = '',
  onSymbolClick,
}: TradingViewScreenerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [widgetKey, setWidgetKey] = useState(0)
  const isMountedRef = useRef(true)
  const initializedRef = useRef(false)
  const widgetIdRef = useRef(`tradingview-screener-${Date.now()}`)
  const originalOpenRef = useRef<typeof window.open | null>(null)
  const clickHandlerRef = useRef<((event: MouseEvent) => void) | null>(null)

  useEffect(() => {
    isMountedRef.current = true
    setIsMounted(true)
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      setWidgetKey(prev => prev + 1)
    }
  }, [symbol, exchange, country, market, isMounted])

  // Extract symbol from URL
  const extractSymbolFromUrl = (url: string): string | null => {
    try {
      const matchPath = url.match(/\/symbols\/([^\/\?]+)/)
      if (matchPath && matchPath[1]) {
        return matchPath[1].split('?')[0].replace(/-/g, ':')
      }

      const urlObj = new URL(url)
      const symbolParam = urlObj.searchParams.get('symbol')
      if (symbolParam) {
        return symbolParam
      }

      const chartMatch = url.match(/\/chart\/([^\/\?]+)/)
      if (chartMatch && chartMatch[1]) {
        return chartMatch[1].split('?')[0]
      }

      return null
    } catch {
      return null
    }
  }

  // Navigate to screener page
  const navigateToScreener = (symbol: string) => {
    if (!symbol || !isMountedRef.current) return
    const cleanSymbol = symbol.replace(/^:+/g, '').trim()
    
    console.log('🔄 Intercepted symbol:', cleanSymbol)
    console.log('📊 Navigating to /screener?symbol=' + encodeURIComponent(cleanSymbol))

    if (onSymbolClick) {
      onSymbolClick(cleanSymbol)
    } else {
      router.push(`/screener?symbol=${encodeURIComponent(cleanSymbol)}`)
    }
  }

  // Load the widget
  useEffect(() => {
    if (!isMounted) return
    
    const container = containerRef.current
    if (!container || initializedRef.current) return

    console.log('📦 Initializing TradingView Screener...')
    
    // Clear container using innerHTML (safe cleanup)
    container.innerHTML = ''
    setIsLoading(true)
    setError(null)

    try {
      // Create wrapper div (React never touches this)
      const wrapper = document.createElement('div')
      wrapper.id = widgetIdRef.current
      wrapper.style.width = '100%'
      wrapper.style.height = '100%'
      wrapper.style.minHeight = '420px'
      wrapper.style.position = 'relative'
      container.appendChild(wrapper)

      // Determine market parameter
      let marketParam = market
      if (country && countryToMarketMap[country]) {
        marketParam = countryToMarketMap[country]
      } else if (country) {
        marketParam = country.toLowerCase().replace(/\s+/g, '_')
      }

      // Create script element for the screener widget
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'
      script.type = 'text/javascript'
      script.async = true

      // Build config
      const config: any = {
        market: marketParam,
        showToolbar: showToolbar,
        defaultColumn: defaultColumn,
        defaultScreen: defaultScreen,
        isTransparent: false,
        colorTheme: colorTheme,
        locale: locale,
        width: typeof width === 'number' ? width : '100%',
        height: typeof height === 'number' ? height : height,
      }

      // Add largeChartUrl to intercept navigation
      config.largeChartUrl = `${window.location.origin}/api/tradingview-proxy`

      console.log('📋 Widget config:', config)

      script.innerHTML = JSON.stringify(config)
      
      script.onload = () => {
        if (isMountedRef.current) {
          console.log('✅ Widget loaded successfully')
          setIsLoading(false)
          initializedRef.current = true
        }
      }

      script.onerror = () => {
        if (isMountedRef.current) {
          console.error('❌ Widget failed to load')
          setError('Failed to load screener. Please refresh and try again.')
          setIsLoading(false)
        }
      }

      wrapper.appendChild(script)

      // Set up document-level click interception (capture phase)
      const handleDocumentClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        const anchor = target.closest('a')
        
        if (anchor?.href) {
          const href = anchor.href
          // Check if it's a TradingView symbol link
          if (href.includes('tradingview.com/symbols/') || 
              href.includes('tradingview.com/chart/')) {
            
            console.log('🛑 Intercepted click:', href)
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            
            const symbol = extractSymbolFromUrl(href)
            if (symbol) {
              navigateToScreener(symbol)
            }
          }
        }
      }

      // Store handler reference for cleanup
      clickHandlerRef.current = handleDocumentClick

      // Override window.open to prevent popups
      originalOpenRef.current = window.open
      window.open = function(url?: string | URL, target?: string, features?: string) {
        if (url && typeof url === 'string' && 
            (url.includes('tradingview.com/symbols/') || url.includes('tradingview.com/chart/'))) {
          console.log('🛑 Intercepted window.open:', url)
          const symbol = extractSymbolFromUrl(url)
          if (symbol) {
            navigateToScreener(symbol)
            return null
          }
        }
        return originalOpenRef.current ? originalOpenRef.current.call(window, url, target, features) : null
      }

      // Add event listener in capture phase
      document.addEventListener('click', handleDocumentClick, true)

      // Loading timeout
      const timeout = setTimeout(() => {
        if (isMountedRef.current && isLoading) {
          console.log('⏰ Loading timeout')
          setIsLoading(false)
        }
      }, 15000)

      // Cleanup function
      return () => {
        console.log('🧹 Cleaning up widget')
        clearTimeout(timeout)
        initializedRef.current = false
        
        // Remove event listener
        if (clickHandlerRef.current) {
          document.removeEventListener('click', clickHandlerRef.current, true)
          clickHandlerRef.current = null
        }
        
        // Restore window.open
        if (originalOpenRef.current) {
          window.open = originalOpenRef.current
          originalOpenRef.current = null
        }
        
        // Safe cleanup using innerHTML
        if (container) {
          container.innerHTML = ''
        }
      }

    } catch (err) {
      console.error('❌ Widget initialization error:', err)
      if (isMountedRef.current) {
        setError('Failed to initialize screener')
        setIsLoading(false)
      }
    }
  }, [market, showToolbar, defaultColumn, defaultScreen, colorTheme, locale, width, height, isMounted, symbol, exchange, country, widgetKey])

  if (!isMounted) {
    return (
      <div 
        className={`relative ${className}`} 
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      />
    )
  }

  const marketNames: Record<string, string> = {
    'stock': 'Stocks',
    'forex': 'Forex',
    'crypto': 'Cryptocurrency',
    'index': 'Indices',
    'futures': 'Futures'
  }

  const displayName = country || marketNames[market] || market

  return (
    <div 
      className={`relative ${className}`} 
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading {displayName} Screener...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl z-10">
          <div className="flex flex-col items-center gap-3 text-center p-4 max-w-md">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button 
              onClick={() => {
                setError(null)
                setIsLoading(true)
                setWidgetKey(prev => prev + 1)
              }}
              className="text-sm text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div 
        ref={containerRef} 
        key={widgetKey}
        className="tradingview-widget-container h-full w-full rounded-xl overflow-hidden"
      />
    </div>
  )
}

export default memo(TradingViewScreener)