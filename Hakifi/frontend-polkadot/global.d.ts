import { widget } from '@/public/assets/tradingview/charting_library';
export {};

declare global {
  interface Window {
    BinanceChain?: any; // 👈️ turn off type checking
    coin98?: any;
    trustwallet?: any;
    tvWidget?: widget
  }
}
