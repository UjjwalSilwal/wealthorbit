'use client'

import { useEffect, useState } from 'react'
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'
import { motion } from 'framer-motion'

interface StockChartProps {
  height?: number
  data?: { time: string; value: number }[]
}

const generateMockData = () => {
  const data = []
  let value = 100
  for (let i = 0; i < 50; i++) {
    value += (Math.random() - 0.5) * 5
    data.push({
      time: `${i}:00`,
      value: Math.round(value * 100) / 100,
    })
  }
  return data
}

export function StockChart({ height = 250, data: propData }: StockChartProps) {
  const [data, setData] = useState(propData || generateMockData())

  useEffect(() => {
    if (!propData) {
      const interval = setInterval(() => {
        setData((prevData) => {
          const newData = [...prevData]
          const lastValue = newData[newData.length - 1].value
          const newValue = lastValue + (Math.random() - 0.5) * 3
          newData.push({
            time: `${newData.length}:00`,
            value: Math.round(newValue * 100) / 100,
          })
          if (newData.length > 50) newData.shift()
          return newData
        })
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [propData])

  const isPositive = data[data.length - 1]?.value > data[0]?.value

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={isPositive ? '#22c55e' : '#ef4444'}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={isPositive ? '#22c55e' : '#ef4444'}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isPositive ? '#22c55e' : '#ef4444'}
            strokeWidth={2}
            fill="url(#colorValue)"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPositive ? '#22c55e' : '#ef4444'}
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  )
}