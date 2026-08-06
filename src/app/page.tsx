"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "market": "forex",
        "showToolbar": true,
        "defaultColumn": "overview",
        "defaultScreen": "general",
        "isTransparent": false,
        "locale": "en",
        "colorTheme": "dark",
        "width": "100%",
        "height": 550
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
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/markets/currencies/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Forex Screener</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

const MemoizedTradingViewWidget = memo(TradingViewWidget);

export default function Home() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/chart'); // Navigate to chart.tsx
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <MemoizedTradingViewWidget />
        <button onClick={handleNavigate}>
          apple
        </button>
      </main>
    </div>
  );
}