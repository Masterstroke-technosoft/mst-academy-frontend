'use client';

import { useState, useEffect } from 'react';
import { getINRtoUSDRate, convertINRtoUSD, formatDualPrice } from '@/lib/currency';

export function useCurrencyRate() {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    getINRtoUSDRate().then(setRate).catch(() => {});
  }, []);

  return { rate, convertINRtoUSD: (inr: number) => rate ? convertINRtoUSD(inr, rate) : null, formatDualPrice: (inr: number) => formatDualPrice(inr, rate) };
}
