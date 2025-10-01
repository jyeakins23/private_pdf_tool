// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://securepdftool.com';
  const locales = ['en', 'ko'] as const;

  // 현 시점 주요 정적 페이지 목록 (필요에 맞게 추가/삭제)
  const pages = [
    '',                 // 홈 (/[locale])
    'privacy',          // /[locale]/privacy
    // 필요시 기능별 랜딩을 따로 두면 여기에 추가:
    'merge', 'compress', 'tables'
  ];

  const lastmod = new Date();

  // 로케일별 URL을 모두 생성 + alternates 설정
  const entries: MetadataRoute.Sitemap = [];

  for (const slug of pages) {
    // 기본 경로(EN 기준)
    const pathEn = `/${locales[0]}${slug ? `/${slug}` : ''}`;

    // 각 로케일 별 주소
    const links = locales.map((l) => ({
      url: `${base}/${l}${slug ? `/${slug}` : ''}`,
      hreflang: l,
    }));

    entries.push({
      url: `${base}${pathEn}`,
      lastModified: lastmod,
      changeFrequency: 'weekly',
      priority: slug === '' ? 1 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          links.map((l) => [l.hreflang, l.url])
        ),
      },
    });
  }

  return entries;
}
