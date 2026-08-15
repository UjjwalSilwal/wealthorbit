'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter,
  ArrowUpDown,
  Star,
  Clock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/animations/AnimatedSection'

// Countries sorted by GDP (nominal) from highest to lowest with their stock market symbols
const countryData = [
  { country: 'United States', symbol: 'SPX', gdp: 26960, exchange: 'NASDAQ' },
  { country: 'China', symbol: '000001.SS', gdp: 17963, exchange: 'SSE' },
  { country: 'Japan', symbol: 'N225', gdp: 4210, exchange: 'TSE' },
  { country: 'Germany', symbol: 'DAX', gdp: 4456, exchange: 'FSE' },
  { country: 'India', symbol: 'NSEI', gdp: 3730, exchange: 'NSE' },
  { country: 'United Kingdom', symbol: 'FTSE', gdp: 3332, exchange: 'LSE' },
  { country: 'France', symbol: 'FCHI', gdp: 3030, exchange: 'EURONEXT' },
  { country: 'Italy', symbol: 'FTMIB', gdp: 2255, exchange: 'BORSA' },
  { country: 'Brazil', symbol: 'BVSP', gdp: 2173, exchange: 'B3' },
  { country: 'Canada', symbol: 'GSPTSE', gdp: 2140, exchange: 'TSX' },
  { country: 'Russia', symbol: 'IMOEX', gdp: 2021, exchange: 'MOEX' },
  { country: 'Mexico', symbol: 'MXX', gdp: 1811, exchange: 'BMV' },
  { country: 'South Korea', symbol: 'KOSPI', gdp: 1709, exchange: 'KRX' },
  { country: 'Australia', symbol: 'AXJO', gdp: 1688, exchange: 'ASX' },
  { country: 'Spain', symbol: 'IBEX', gdp: 1580, exchange: 'BME' },
  { country: 'Indonesia', symbol: 'JKSE', gdp: 1417, exchange: 'IDX' },
  { country: 'Turkey', symbol: 'XU100', gdp: 1108, exchange: 'BIST' },
  { country: 'Saudi Arabia', symbol: 'TASI', gdp: 1069, exchange: 'TADAWUL' },
  { country: 'Netherlands', symbol: 'AEX', gdp: 1055, exchange: 'EURONEXT' },
  { country: 'Switzerland', symbol: 'SSMI', gdp: 884, exchange: 'SIX' },
  { country: 'Poland', symbol: 'WIG20', gdp: 842, exchange: 'WSE' },
  { country: 'Argentina', symbol: 'MERV', gdp: 801, exchange: 'BCBA' },
  { country: 'Belgium', symbol: 'BEL20', gdp: 630, exchange: 'EURONEXT' },
  { country: 'Sweden', symbol: 'OMX', gdp: 593, exchange: 'OMX' },
  { country: 'Ireland', symbol: 'ISEQ', gdp: 589, exchange: 'ISE' },
  { country: 'Austria', symbol: 'ATX', gdp: 527, exchange: 'VIE' },
  { country: 'Singapore', symbol: 'STI', gdp: 525, exchange: 'SGX' },
  { country: 'Israel', symbol: 'TA125', gdp: 522, exchange: 'TASE' },
  { country: 'Norway', symbol: 'OSEAX', gdp: 506, exchange: 'OSE' },
  { country: 'United Arab Emirates', symbol: 'DFMGI', gdp: 504, exchange: 'DFM' },
  { country: 'Thailand', symbol: 'SET', gdp: 502, exchange: 'SET' },
  { country: 'Bangladesh', symbol: 'DSEX', gdp: 460, exchange: 'DSE' },
  { country: 'Malaysia', symbol: 'KLSE', gdp: 445, exchange: 'BURSA' },
  { country: 'Vietnam', symbol: 'VNINDEX', gdp: 433, exchange: 'HOSE' },
  { country: 'South Africa', symbol: 'JALSH', gdp: 399, exchange: 'JSE' },
  { country: 'Hong Kong', symbol: 'HSI', gdp: 383, exchange: 'HKEX' },
  { country: 'Denmark', symbol: 'OMXC20', gdp: 382, exchange: 'OMX' },
  { country: 'Philippines', symbol: 'PSEI', gdp: 372, exchange: 'PSE' },
  { country: 'Egypt', symbol: 'EGX30', gdp: 347, exchange: 'EGX' },
  { country: 'Chile', symbol: 'IPSA', gdp: 340, exchange: 'BCS' },
  { country: 'Finland', symbol: 'OMXH25', gdp: 308, exchange: 'OMX' },
  { country: 'Pakistan', symbol: 'KSE100', gdp: 303, exchange: 'PSX' },
  { country: 'Colombia', symbol: 'COLCAP', gdp: 290, exchange: 'BVC' },
]

export default function MarketsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'country' | 'gdp'>('gdp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredData = countryData
    .filter(item => 
      item.country.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1
      if (sortBy === 'country') return a.country.localeCompare(b.country) * order
      if (sortBy === 'gdp') return (a.gdp - b.gdp) * order
      return 0
    })

  const handleCountryClick = (country: typeof countryData[0]) => {
    // Navigate to dashboard with country data as parameters
    router.push(
      `/dashboard?country=${encodeURIComponent(country.country)}&symbol=${encodeURIComponent(country.symbol)}&exchange=${encodeURIComponent(country.exchange)}`
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Countries</h1>
          <p className="text-muted-foreground">Countries sorted by GDP (nominal)</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'country' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              if (sortBy === 'country') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              } else {
                setSortBy('country')
                setSortOrder('asc')
              }
            }}
          >
            Country
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
          <Button
            variant={sortBy === 'gdp' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              if (sortBy === 'gdp') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              } else {
                setSortBy('gdp')
                setSortOrder('desc')
              }
            }}
          >
            GDP
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredData.map((item, index) => (
          <AnimatedSection key={item.country} delay={index * 0.03}>
            <Card 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              onClick={() => handleCountryClick(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-500 transition-colors" />
                      <div>
                        <div className="font-semibold">{item.country}</div>
                        <div className="text-sm text-muted-foreground">
                          #{index + 1} by GDP
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm text-muted-foreground">Index Symbol</div>
                      <div className="font-medium text-primary">{item.symbol}</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-sm text-muted-foreground">Exchange</div>
                      <div className="font-medium">{item.exchange}</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-sm text-muted-foreground">GDP Rank</div>
                      <div className="font-medium">#{index + 1}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation()
                      handleCountryClick(item)
                    }}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}