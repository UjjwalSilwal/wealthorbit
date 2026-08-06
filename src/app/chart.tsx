"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, memo } from 'react';

// You can reuse the same TradingView widget or create a different one
function TradingViewChartWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "EURUSD",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;
    
    if (container.current) {
      container.current.appendChild(script);
    }

    return () => {
      if (container.current) {
        const scriptToRemove = container.current.querySelector('script');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container w-full h-[600px]" ref={container}>
      <div className="tradingview-widget-container__widget w-full h-full"></div>
    </div>
  );
}

const MemoizedTradingViewChartWidget = memo(TradingViewChartWidget);

export default function Chart() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // Go back to previous page
    // OR router.push('/'); // Go to home page
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-6xl flex-col items-center justify-center py-8 px-16 bg-white dark:bg-black">
        {/* Header with back button */}
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Forex Chart
          </h1>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← Go Back
          </button>
        </div>
        
        {/* Chart Widget */}
        <MemoizedTradingViewChartWidget />
        
        {/* Additional Info */}
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>EUR/USD Daily Chart - Powered by TradingView</p>
        </div>
      </main>
    </div>
  );
}