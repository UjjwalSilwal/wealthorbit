'use client'

import React, { useEffect, useRef } from 'react'

interface TradingViewCompanyProfileProps {
  symbol: string
  className?: string
  height?: number
  width?: string | number
  colorTheme?: 'light' | 'dark'
  locale?: string
}

export default function TradingViewCompanyProfile({
  symbol,
  className = '',
  height = 350,
  width = '100%',
  colorTheme = 'light',
  locale = 'en'
}: TradingViewCompanyProfileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Clean up previous widget
    if (widgetRef.current) {
      widgetRef.current.remove()
      widgetRef.current = null
    }

    // Load the TradingView script
    const script = document.createElement('script')
    script.src = 'https://widgets.tradingview-widget.com/w/en/tv-company-profile.js'
    script.type = 'module'
    script.async = true

    script.onload = () => {
      // Create the company profile widget
      const widget = document.createElement('tv-company-profile')
      widget.setAttribute('symbol', symbol)
      widget.setAttribute('color-theme', colorTheme)
      widget.setAttribute('locale', locale)
      widget.setAttribute('height', height.toString())
      widget.setAttribute('width', typeof width === 'number' ? width.toString() : width)
      
      // Store reference and append
      widgetRef.current = widget
      if (containerRef.current) {
        containerRef.current.appendChild(widget)
      }
    }

    // Append script to body
    document.body.appendChild(script)

    // Cleanup
    return () => {
      // Remove script
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      // Remove widget
      if (widgetRef.current && containerRef.current) {
        containerRef.current.removeChild(widgetRef.current)
        widgetRef.current = null
      }
    }
  }, [symbol, colorTheme, locale, height, width])

  return (
    <div 
      ref={containerRef} 
      className={`tradingview-company-profile ${className}`}
      style={{ height, width }}
    />
  )
}