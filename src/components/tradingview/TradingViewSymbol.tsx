'use client'

import React, { useEffect, useRef, memo } from 'react'

interface TradingViewSymbolProps {
  symbol?: string
}

const TradingViewSymbol = memo(({ symbol = "NASDAQ:AAPL" }: TradingViewSymbolProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;

    // Clear previous widget script/elements on change
    currentContainer.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      colorTheme: "dark",
      isTransparent: false,
      locale: "en",
      width: "100%"
    });

    currentContainer.appendChild(script);

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container w-full" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
});

TradingViewSymbol.displayName = 'TradingViewSymbol';

export default TradingViewSymbol