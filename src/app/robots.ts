import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/*.css$',
          '/*.js$',
          '/*.png$',
          '/*.jpg$',
          '/*.svg$',
          '/*.webp$',
        ],
        disallow: [
          '/login',
          '/register',
          '/dashboard',
          '/account',
          '/api/',
          '/*?*token=',
          '/*?*session=',
        ],
      },
    ],
    sitemap: 'https://masterstroke.academy/sitemap.xml',
    host: 'https://masterstroke.academy',
  }
}
