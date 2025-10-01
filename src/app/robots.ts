// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://securepdftool.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 필요하면 민감 경로를 disallow에 추가
      // disallow: ['/api/', '/admin/'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
