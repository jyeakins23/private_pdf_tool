import '../globals.css';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
// 상단 import
import ServiceWorker from '@/components/ServiceWorker';

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
    url: 'https://yourdomain.com',
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
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ServiceWorker />
          <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
