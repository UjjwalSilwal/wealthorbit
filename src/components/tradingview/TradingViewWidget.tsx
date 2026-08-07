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
  backgroundColor = '#131722',
  className = '',
  height = '100%',
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    const containerElement = container.current
    if (!containerElement) return

    setIsLoading(true)
    setError(null)

    try {
      // Clear previous content
      containerElement.innerHTML = ''

      // Create script
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.type = 'text/javascript'
      script.async = true

      const config = {
        width: '100%',
        height: '100%',
        symbol: symbol,
        interval: interval,
        timezone: 'Etc/UTC',
        theme: theme,
        style: '1',
        locale: 'en',
        allow_symbol_change: allowSymbolChange,
        hide_side_toolbar: hideSideToolbar,
        hide_top_toolbar: hideTopToolbar,
        hide_legend: false,
        hide_volume: false,
        save_image: true,
        calendar: false,
        details: false,
        hotlist: false,
        withdateranges: false,
        backgroundColor: backgroundColor,
        gridColor: theme === 'dark' ? 'rgba(242, 242, 242, 0.06)' : 'rgba(0, 0, 0, 0.06)',
        studies: [],
        watchlist: [],
        compareSymbols: [],
        autosize: true,
      }

      script.innerHTML = JSON.stringify(config)
      
      script.onload = () => {
        setIsLoading(false)
      }

      script.onerror = () => {
        setError('Failed to load chart. Please refresh and try again.')
        setIsLoading(false)
      }

      containerElement.appendChild(script)

      // Cleanup timeout
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
        }
      }, 10000)

      return () => {
        clearTimeout(timeout)
        if (containerElement) {
          const scriptElement = containerElement.querySelector('script')
          if (scriptElement) {
            scriptElement.remove()
          }
        }
      }
    } catch (err) {
      console.error('TradingView widget error:', err)
      setError('Failed to initialize chart')
      setIsLoading(false)
    }
  }, [symbol, theme, interval, allowSymbolChange, hideTopToolbar, hideSideToolbar, backgroundColor, isMounted])

  if (!isMounted) {
    return (
      <div 
        className={`relative ${className}`} 
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      />
    )
  }

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
                const containerElement = container.current
                if (containerElement) {
                  containerElement.innerHTML = ''
                  const script = document.createElement('script')
                  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
                  script.type = 'text/javascript'
                  script.async = true
                  const config = {
                    width: '100%',
                    height: '100%',
                    symbol: symbol,
                    interval: interval,
                    timezone: 'Etc/UTC',
                    theme: theme,
                    style: '1',
                    locale: 'en',
                    allow_symbol_change: allowSymbolChange,
                    hide_side_toolbar: hideSideToolbar,
                    hide_top_toolbar: hideTopToolbar,
                    backgroundColor: backgroundColor,
                    autosize: true,
                  }
                  script.innerHTML = JSON.stringify(config)
                  script.onload = () => {
                    setIsLoading(false)
                  }
                  script.onerror = () => {
                    setError('Failed to load chart. Please refresh and try again.')
                    setIsLoading(false)
                  }
                  containerElement.appendChild(script)
                }
              }}
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