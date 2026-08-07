export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  symbol?: string[];
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  alerts?: Alert[];
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'price_above' | 'price_below' | 'volume';
  value: number;
  triggered: boolean;
}

export interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  watchlist: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  defaultChart: 'line' | 'candle' | 'area';
  currency: 'USD' | 'EUR' | 'GBP';
}