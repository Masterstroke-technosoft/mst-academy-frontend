import type { MetadataRoute } from 'next'
import { FEATURED_BLOGS } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://masterstroke.academy'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                       lastModified: now, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${base}/academy-overview`, lastModified: now, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/learn`,            lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/register`,         lastModified: now, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/blogs`,            lastModified: now, priority: 0.9, changeFrequency: 'daily' },
    { url: `${base}/contact-us`,       lastModified: now, priority: 0.4, changeFrequency: 'yearly' },
    { url: `${base}/refund-policy`,    lastModified: now, priority: 0.2, changeFrequency: 'yearly' },
    { url: `${base}/terms-conditions`, lastModified: now, priority: 0.2, changeFrequency: 'yearly' },
    { url: `${base}/privacy-policy`,   lastModified: now, priority: 0.2, changeFrequency: 'yearly' },
  ]

  const blogPages: MetadataRoute.Sitemap = FEATURED_BLOGS.map((post) => ({
    url: `${base}/blogs/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }))

  return [...staticPages, ...blogPages]
}
