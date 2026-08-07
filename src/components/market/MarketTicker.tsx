'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface TickerItem {
  symbol: string
  price: string
  change: string
  positive: boolean
}

const tickerData: TickerItem[] = [
  { symbol: 'AAPL', price: '$198.45', change: '+2.4%', positive: true },
  { symbol: 'GOOGL', price: '$173.20', change: '+1.8%', positive: true },
  { symbol: 'MSFT', price: '$378.90', change: '-0.3%', positive: false },
  { symbol: 'AMZN', price: '$186.50', change: '+3.1%', positive: true },
  { symbol: 'TSLA', price: '$265.30', change: '-1.2%', positive: false },
  { symbol: 'META', price: '$365.80', change: '+2.7%', positive: true },
  { symbol: 'NVDA', price: '$825.20', change: '+4.5%', positive: true },
  { symbol: 'JPM', price: '$159.40', change: '+1.1%', positive: true },
  { symbol: 'VTI', price: '$278.30', change: '-0.5%', positive: false },
  { symbol: 'SPY', price: '$512.60', change: '+0.8%', positive: true },
]

export function MarketTicker() {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div className="bg-card/50 border-y border-border/50 overflow-hidden py-3">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: isHovered ? 0 : ['0%', '-100%'],
        }}
        transition={{
          x: {
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          },
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {[...tickerData, ...tickerData, ...tickerData].map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-6 px-6"
          >
            <span className="font-semibold">{item.symbol}</span>
            <span>{item.price}</span>
            <span className={item.positive ? 'text-green-500' : 'text-red-500'}>
              {item.change}
            </span>
            <div className="w-px h-6 bg-border/50" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}