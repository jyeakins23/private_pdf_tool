// src/app/[locale]/layout.tsx
import '../globals.css';
import {ReactNode, Suspense} from 'react';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import ServiceWorker from '@/components/ServiceWorker';
import Analytics from '@/components/Analytics';
import Script from 'next/script';

// 이 블록만 교체: src/app/[locale]/layout.tsx 상단의 export const metadata
export const metadata = {
  metadataBase: new URL('https://securepdftool.com'),
  title: {
    default: 'PDF Studio — Merge · Compress · Table Extract',
    template: '%s · PDF Studio'
  },
  description: 'Private PDF tools. Free, no uploads, runs in your browser.',
  openGraph: {
    title: 'PDF Studio',
    description: 'Merge, compress, and extract tables privately in your browser.',
    url: 'https://securepdftool.com',
    siteName: 'PDF Studio',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Studio',
    description: 'Private PDF tools in your browser',
    images: ['/og.png']
  },
  icons: { icon: '/favicon.ico' },
  // ✅ SEO 강화: canonical + 언어 대체 링크
  alternates: {
    canonical: 'https://securepdftool.com',
    languages: {
      en: 'https://securepdftool.com/en',
      ko: 'https://securepdftool.com/ko'
    }
  }
} as const;

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'ko'}];
}

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!['en','ko'].includes(locale)) notFound();

  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

  // GA 측정 ID (.env.local: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXX)
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang={locale}>
      <head>
        {/* 성능: 광고/측정 도메인 preconnect */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* Consent Mode v2 기본값(동의 전 비개인화) */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              ad_storage: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted'
            });
          `}
        </Script>

        {/* AdSense 로더: Next <Script> 대신 일반 <script> 사용(AdSense 경고 회피) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7959771468883592"
          crossOrigin="anonymous"
        ></script>

        {/* ✅ GA4 gtag.js: Next <Script> 사용 → Vercel 경고 해소 */}
        {GA_ID && (
          <>
            <Script
              id="gtag-src"
              async
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                // SPA에서 페이지뷰는 Analytics 컴포넌트가 보냄
                gtag('config', '${GA_ID}', { send_page_view: false });
              `}
            </Script>

            {/* (선택) 테스트 편의를 위한 분석 동의 임시 부여 */}
            {/* <Script id="consent-grant-analytics" strategy="afterInteractive">
              {`gtag('consent','update',{analytics_storage:'granted'});`}
            </Script> */}
          </>
        )}
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ServiceWorker />
          {/* 라우트 변경마다 page_view 전송 */}
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
