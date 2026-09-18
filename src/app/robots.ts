import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/leaderboard',   // dynamic personal user data — no independent search value
          '/api/',
          '/register/confirm',
        ],
      },
    ],
    sitemap: 'https://masterstroke.academy/sitemap.xml',
  }
}
