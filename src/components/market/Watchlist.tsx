'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Star, 
  MoreHorizontal,
  Search,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const watchlistItems = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 198.45, change: 2.4 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 173.20, change: 1.8 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: -0.3 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.50, change: 3.1 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 265.30, change: -1.2 },
]

export function Watchlist() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = watchlistItems.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Watchlist</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search watchlist..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                  <div>
                    <div className="font-semibold">{item.symbol}</div>
                    <div className="text-sm text-muted-foreground">{item.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${item.price.toFixed(2)}</div>
                  <div className={`text-sm ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}