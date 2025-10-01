// src/app/[locale]/layout.tsx
import '../globals.css';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import ServiceWorker from '@/components/ServiceWorker';
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
        {/* 성능: 광고/측정 도메인 preconnect로 초기 지연 최소화 */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" crossOrigin="anonymous" />

        {/* Consent Mode v2 기본 상태: 동의 전 비개인화(필요시 CMP에서 업데이트) */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'granted',
              'security_storage': 'granted'
            });
          `}
        </Script>

        {/* (선택) gtag 기본 초기화가 필요하면 여기에 추가 가능
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());`}
        </Script>
        */}
        
        {/* AdSense 전역 스크립트 — 본인 퍼블리셔 ID로 교체하세요 */}
        <Script
          id="adsense"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7959771468883592"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ServiceWorker />
          <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
