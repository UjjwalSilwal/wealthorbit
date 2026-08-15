// app/api/tradingview-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // TradingView passes the symbol as 'tvwidgetsymbol' or 'symbol'
  const symbol = searchParams.get('tvwidgetsymbol') || searchParams.get('symbol')
  
  console.log('🔍 TradingView proxy called with:', { symbol, allParams: Object.fromEntries(searchParams) })
  
  if (symbol) {
    // Clean the symbol (remove any extra encoding)
    const cleanSymbol = decodeURIComponent(symbol).replace(/-/g, ':')
    
    // Redirect to the screener page with the symbol
    const redirectUrl = new URL('/screener', request.url)
    redirectUrl.searchParams.set('symbol', cleanSymbol)
    
    console.log('🔄 Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }
  
  // If no symbol, redirect to markets page
  console.log('⚠️ No symbol found, redirecting to markets')
  return NextResponse.redirect(new URL('/markets', request.url))
}