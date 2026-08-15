'use client'

import React, { useEffect, useRef, memo, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface TradingViewTechnicalProps {
  symbol?: string
  colorTheme?: 'light' | 'dark'
  locale?: string
  width?: string | number
  height?: string | number
  className?: string
}

function TradingViewTechnical({
  symbol = 'NASDAQ:AAPL',
  colorTheme = 'dark',
  locale = 'en',
  width = '100%',
  height = 400,
  className = '',
}: TradingViewTechnicalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const containerElement = containerRef.current
    if (!containerElement) return

    setIsLoading(true)
    setError(null)

    try {
      // Clean up previous widget
      if (widgetRef.current && containerElement.contains(widgetRef.current)) {
        containerElement.removeChild(widgetRef.current)
        widgetRef.current = null
      }

      // Clear any existing content
      containerElement.innerHTML = ''

      // Create the technical analysis widget
      const widget = document.createElement('tv-technical-analysis')
      widget.setAttribute('symbol', symbol)
      widget.setAttribute('color-theme', colorTheme)
      widget.setAttribute('locale', locale)
      widget.setAttribute('height', typeof height === 'number' ? height.toString() : height)
      widget.setAttribute('width', typeof width === 'number' ? width.toString() : width)

      // Store reference
      widgetRef.current = widget

      // Add load event listener
      widget.addEventListener('load', () => {
        setIsLoading(false)
      })

      // Append widget to container
      containerElement.appendChild(widget)

      // Fallback timeout
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
        }
      }, 10000)

      // Cleanup
      return () => {
        clearTimeout(timeout)
        if (widgetRef.current && containerElement.contains(widgetRef.current)) {
          containerElement.removeChild(widgetRef.current)
          widgetRef.current = null
        }
      }
    } catch (err) {
      console.error('TradingView technical analysis widget error:', err)
      setError('Failed to load technical analysis. Please refresh and try again.')
      setIsLoading(false)
    }
  }, [symbol, colorTheme, locale, width, height, isMounted])

  // Load the TradingView script
  useEffect(() => {
    if (!isMounted) return

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://widgets.tradingview-widget.com/w/en/tv-technical-analysis.js"]'
    )
    
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://widgets.tradingview-widget.com/w/en/tv-technical-analysis.js'
      script.type = 'module'
      script.async = true

      script.onload = () => {
        // Script loaded, widget will be created in the other useEffect
      }

      script.onerror = () => {
        setError('Failed to load technical analysis script. Please refresh and try again.')
        setIsLoading(false)
      }

      document.body.appendChild(script)

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [isMounted])

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
            <p className="text-sm text-muted-foreground">Loading technical analysis...</p>
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
                const containerElement = containerRef.current
                if (containerElement) {
                  containerElement.innerHTML = ''
                  const widget = document.createElement('tv-technical-analysis')
                  widget.setAttribute('symbol', symbol)
                  widget.setAttribute('color-theme', colorTheme)
                  widget.setAttribute('locale', locale)
                  widget.setAttribute('height', typeof height === 'number' ? height.toString() : height)
                  widget.setAttribute('width', typeof width === 'number' ? width.toString() : width)
                  widgetRef.current = widget
                  widget.addEventListener('load', () => {
                    setIsLoading(false)
                  })
                  containerElement.appendChild(widget)
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
        ref={containerRef} 
        className="tradingview-technical-container h-full w-full rounded-xl overflow-hidden"
      />
    </div>
  )
}

export default memo(TradingViewTechnical)