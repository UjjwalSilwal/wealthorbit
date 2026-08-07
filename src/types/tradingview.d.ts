// src/types/tradingview.d.ts

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tv-market-data': {
        'symbol-sectors'?: string
        children?: React.ReactNode
      }
    }
  }
}

export {}