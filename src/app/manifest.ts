// src/app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PDF Studio — Private PDF Tools',
    short_name: 'PDF Studio',
    description:
      'Merge, compress, and extract tables entirely in your browser. No uploads. No tracking.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0b0c0e',
    theme_color: '#5b9cff',
    lang: 'en',
    dir: 'ltr',
    categories: ['productivity', 'utilities'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
    ]
  };
}
