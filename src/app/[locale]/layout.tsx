// src/app/[locale]/layout.tsx
import '../globals.css';
import {ReactNode, Suspense} from 'react';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import ServiceWorker from '@/components/ServiceWorker';
import Analytics from '@/components/Analytics';
import Script from 'next/script';

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
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Studio',
    description: 'Private PDF tools in your browser',
    images: ['/og.png']
  },
  icons: { icon: '/favicon.ico' }
};

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

  return (
    <html lang={locale}>
      <head>
        {/* 성능: 광고/측정 도메인 preconnect */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
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

        {/* AdSense (퍼블리셔 ID 교체) */}
        <Script
          id="adsense"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7959771468883592"
          crossOrigin="anonymous"
        />

        {/* GA4 gtag.js 로더 */}
        <Script
          id="gtag-src"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        {/* GA4 초기화(send_page_view는 라우팅 훅에서 직접 보냄) */}
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', { send_page_view: false });
          `}
        </Script>
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ServiceWorker />
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
