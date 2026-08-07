'use client'

import React, { useEffect, useRef, memo, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface TradingViewWidgetProps {
  symbol?: string
  theme?: 'dark' | 'light'
  interval?: '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M'
  allowSymbolChange?: boolean
  hideTopToolbar?: boolean
  hideSideToolbar?: boolean
  backgroundColor?: string
  className?: string
  height?: string | number
}

function TradingViewWidget({
  symbol = 'NASDAQ:AAPL',
  theme = 'dark',
  interval = 'D',
  allowSymbolChange = true,
  hideTopToolbar = false,
  hideSideToolbar = true,
  backgroundColor = '#0F0F0F',
  className = '',
  height = '100%',
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const containerElement = container.current
    if (!containerElement) return

    setIsLoading(true)
    setError(null)

    try {
      // Clear previous script
      const existingScript = containerElement.querySelector('script')
      if (existingScript) {
        existingScript.remove()
      }

      // Create script
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.type = 'text/javascript'
      script.async = true

      const config = {
        allow_symbol_change: allowSymbolChange,
        calendar: false,
        details: false,
        hide_side_toolbar: hideSideToolbar,
        hide_top_toolbar: hideTopToolbar,
        hide_legend: false,
        hide_volume: false,
        hotlist: false,
        interval: interval,
        locale: 'en',
        save_image: true,
        style: '1',
        symbol: symbol,
        theme: theme,
        timezone: 'Etc/UTC',
        backgroundColor: backgroundColor,
        gridColor: theme === 'dark' ? 'rgba(242, 242, 242, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        watchlist: [],
        withdateranges: false,
        compareSymbols: [],
        studies: [],
        autosize: true,
      }

      script.innerHTML = JSON.stringify(config)
      
      script.onload = () => {
        setIsLoading(false)
      }

      script.onerror = () => {
        setError('Failed to load chart')
        setIsLoading(false)
      }

      containerElement.appendChild(script)

      // Timeout for loading
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
        }
      }, 8000)

      return () => {
        clearTimeout(timeout)
        if (containerElement) {
          const scriptToRemove = containerElement.querySelector('script')
          if (scriptToRemove) {
            scriptToRemove.remove()
          }
        }
      }
    } catch (err) {
      setError('Failed to initialize chart')
      setIsLoading(false)
    }
  }, [symbol, theme, interval, allowSymbolChange, hideTopToolbar, hideSideToolbar, backgroundColor, isLoading])

  return (
    <div 
      className={`relative ${className}`} 
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl z-10">
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

      <div 
        ref={container} 
        className="tradingview-widget-container h-full w-full rounded-xl overflow-hidden"
      >
        <div 
          className="tradingview-widget-container__widget" 
          style={{ height: 'calc(100% - 32px)', width: '100%' }}
        />
        <div className="tradingview-widget-copyright text-xs text-muted-foreground/50 px-4 py-1">
          <a 
            href={`https://www.tradingview.com/symbols/${symbol.replace(':', '-')}/`} 
            rel="noopener nofollow" 
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            <span className="blue-text">{symbol.split(':')[1] || symbol} chart</span>
          </a>
          <span className="trademark"> by TradingView</span>
        </div>
      </div>
    </div>
  )
}

export default memo(TradingViewWidget)