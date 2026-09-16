const CACHE_KEY = 'mst_usd_rate';
const CACHE_TTL_MS = 30 * 60 * 1000;

let inflight: Promise<number> | null = null;

async function fetchRate(): Promise<number> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    if (!baseUrl) return 86.5;
    const res = await fetch(`${baseUrl}/api/currency/inr-to-usd?amount=1`, {
      cache: "no-store",
    });
    if (!res.ok) return 86.5;
    const data = await res.json();
    return typeof data?.result === "number" ? data.result : 86.5;
  } catch {
    return 86.5;
  }
}

export async function getINRtoUSDRate(): Promise<number> {
  if (typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rate, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL_MS) return rate;
      }
    } catch {}
  }

  if (inflight) return inflight;
  inflight = fetchRate().then((rate) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ rate, ts: Date.now() }));
      } catch {}
    }
    inflight = null;
    return rate;
  }).catch((err) => {
    inflight = null;
    throw err;
  });
  return inflight;
}

export function convertINRtoUSD(inr: number, rate: number): number {
  return Math.round((inr / rate) * 100) / 100;
}

export function formatDualPrice(inr: number, usdRate: number | null): string {
  const inrStr = `Rs ${inr.toLocaleString('en-IN')}`;
  if (!usdRate) return inrStr;
  const usd = convertINRtoUSD(inr, usdRate);
  return `${inrStr} / $${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
