import type { MetadataRoute } from 'next'

const BASE = 'https://masterstroke.academy'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { url: `${BASE}/`,                 lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/academy-overview`, lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/learn`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/leaderboard`,      lastModified: now, changeFrequency: 'daily',   priority: 0.5 },
    { url: `${BASE}/contact-us`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/refund-policy`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms-conditions`, lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/privacy-policy`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
