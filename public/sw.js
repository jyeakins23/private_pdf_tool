// public/sw.js
const VERSION = 'v3';

// 항상 존재하는 정적 파일만 프리캐시
const CORE = [
  '/manifest.webmanifest',
  '/pdf.worker.min.mjs',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    for (const url of CORE) {
      try { await cache.add(url); } catch (_) { /* missing ok */ }
    }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// 안전하게 캐시에 넣는 헬퍼
async function safePut(request, response) {
  try {
    if (request.method !== 'GET') return;
    if (!response || response.status !== 200) return;
    // same-origin 응답만 (opaque 제외) — 개발/로컬에서 안전
    if (response.type !== 'basic') return;
    const cache = await caches.open(VERSION);
    // 🔐 복제는 "put" 직전에 1번만
    await cache.put(request, response.clone());
  } catch (_) {
    // 캐시 실패는 조용히 무시
  }
}

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1) pdf.worker: Cache First
  if (url.pathname.endsWith('/pdf.worker.min.mjs')) {
    e.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const res = await fetch(request);
      await safePut(request, res);
      return res;
    })());
    return;
  }

  // 2) Next 정적 자산 & 아이콘: Stale-While-Revalidate
  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/icons')) {
    e.respondWith((async () => {
      const cached = await caches.match(request);
      const network = fetch(request)
        .then(async (res) => { await safePut(request, res); return res; })
        .catch(() => undefined);
      return cached || (await network) || new Response('', { status: 504, statusText: 'Gateway Timeout' });
    })());
    return;
  }

  // 3) 기본: Network First (+ offline fallback)
  e.respondWith((async () => {
    try {
      const res = await fetch(request);
      await safePut(request, res);
      return res;
    } catch {
      const cached = await caches.match(request);
      return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
});
