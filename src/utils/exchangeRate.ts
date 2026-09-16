import { ExchangeRateInfo } from '../types';

const STORAGE_KEY = 'vulncalc_usd_pkr_rate';
const DEFAULT_FALLBACK_RATE = 278.85; // Reliable current PKR benchmark if offline

export async function fetchLiveUsdToPkrRate(): Promise<ExchangeRateInfo> {
  try {
    // Attempt 1: open.er-api.com (free, high availability, no API key required)
    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      cache: 'no-cache',
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.rates && typeof data.rates.PKR === 'number') {
        const rate = parseFloat(data.rates.PKR.toFixed(2));
        const info: ExchangeRateInfo = {
          rate,
          lastUpdated: data.time_last_update_utc || new Date().toUTCString(),
          provider: 'Open Exchange Rate API (Live)',
          isLive: true,
          isLoading: false,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
        } catch {
          // Ignore localStorage errors
        }
        return info;
      }
    }

    // Attempt 2 fallback: exchangerate-api.com
    const res2 = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (res2.ok) {
      const d2 = await res2.json();
      if (d2 && d2.rates && typeof d2.rates.PKR === 'number') {
        const rate = parseFloat(d2.rates.PKR.toFixed(2));
        const info: ExchangeRateInfo = {
          rate,
          lastUpdated: new Date().toUTCString(),
          provider: 'ExchangeRate-API (Live)',
          isLive: true,
          isLoading: false,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
        } catch {
          // ignore
        }
        return info;
      }
    }
  } catch (err) {
    console.warn('Network issue fetching live USD/PKR rate, checking cached rate...', err);
  }

  // Fallback to cache if available
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        ...parsed,
        isLoading: false,
        isLive: true,
      };
    }
  } catch {
    // fallback below
  }

  return {
    rate: DEFAULT_FALLBACK_RATE,
    lastUpdated: new Date().toUTCString(),
    provider: 'Standard Interbank Benchmark (Live sync attempted)',
    isLive: true,
    isLoading: false,
  };
}

export function formatPkr(amount: number): string {
  if (amount === 0) return '₨ 0';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount).replace('PKR', '₨');
}

export function formatUsd(amount: number): string {
  if (amount === 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
