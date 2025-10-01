// public/sw.js
const VERSION = 'v5'; // ← 버전 올려 강제 업데이트

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
      try { await cache.add(url); } catch (_) { /* optional */ }
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

// 안전하게 캐시에 넣는 헬퍼(동일 출처 & 200 OK & 기본 응답만)
async function safePut(request, response) {
  try {
    if (request.method !== 'GET') return;
    if (!response || response.status !== 200) return;
    if (response.type !== 'basic') return; // cross-origin(opaque) 제외
    const cache = await caches.open(VERSION);
    await cache.put(request, response.clone());
  } catch (_) {
    // 캐시 실패는 무시
  }
}

// 광고/태그는 절대 가로채지 않음(네트워크 직행)
const BYPASS_HOSTS = new Set([
  'pagead2.googlesyndication.com',
  'googleads.g.doubleclick.net',
  'tpc.googlesyndication.com',
  'www.googletagmanager.com',
  'www.google-analytics.com',       // ✅ 추가
  'region1.google-analytics.com'    // ✅ 추가 (리전 수집 엔드포인트)
]);

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 0) 광고/태그 도메인은 무조건 네트워크로
  if (BYPASS_HOSTS.has(url.hostname)) {
    e.respondWith(fetch(request));
    return;
  }

  const sameOrigin = (url.origin === self.location.origin);

  // 0.5) 교차 출처는 캐시/오프라인 개입 없이 네트워크로 통과
  if (!sameOrigin) {
    e.respondWith(fetch(request));
    return;
  }

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

  // 3) 기본: Network First (+ same-origin에 한해 offline fallback)
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
