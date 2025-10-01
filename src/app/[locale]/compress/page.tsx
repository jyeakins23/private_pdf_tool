// src/app/[locale]/compress/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: 'en' | 'ko' } }): Promise<Metadata> {
  const en = params.locale === 'en';
  return {
    title: en ? 'Compress PDF — Reduce Size, Keep Quality' : 'PDF 압축 — 용량 줄이고 품질 유지',
    description: en
      ? 'Shrink PDF size in your browser with privacy-first compression. Choose strong, standard, or keep-quality settings.'
      : '브라우저에서 개인정보 보호 중심으로 PDF 용량을 줄이세요. 강력/표준/품질유지 옵션을 선택할 수 있습니다.',
    alternates: {
      languages: {
        en: 'https://securepdftool.com/en/compress',
        ko: 'https://securepdftool.com/ko/compress'
      }
    }
  };
}

export default function Page({ params }: { params: { locale: 'en' | 'ko' } }) {
  const en = params.locale === 'en';

  const intro = en
    ? 'Compress PDFs locally for email, web, or archiving. Pick the right balance between file size and clarity, exclude pages you don’t need, and keep text selectable whenever possible.'
    : '이메일·웹·보관 용도로 PDF를 로컬에서 압축하세요. 파일 크기와 선명도의 균형을 선택하고 불필요한 페이지를 제외할 수 있으며, 가능하면 텍스트 선택 기능을 유지합니다.';

  const bullets = en
    ? ['Local-only compression', 'Strong / Standard / Keep-quality', 'Exclude specific pages', 'Fast, offline-capable']
    : ['로컬 전용 압축', '강력/표준/품질유지 옵션', '특정 페이지 제외 가능', '빠르고 오프라인 지원'];

  const faqs = [
    en
      ? {
          q: 'Can I exclude pages from compression?',
          a: 'Yes. You can exclude first/last or selected pages to keep them untouched.'
        }
      : {
          q: '특정 페이지는 압축하지 않을 수 있나요?',
          a: '가능합니다. 첫 장/마지막 장 또는 원하는 페이지만 제외해 원본 품질을 유지할 수 있습니다.'
        },
    en
      ? {
          q: 'Does the tool upload my files?',
          a: 'No. Compression happens directly in your browser for privacy and speed.'
        }
      : {
          q: '파일이 업로드되나요?',
          a: '아니요. 모든 압축은 브라우저에서 로컬로 진행되어 빠르고 안전합니다.'
        }
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };

  return (
    <main className="prose prose-invert max-w-3xl">
      <h1>{en ? 'Compress PDF — Reduce Size, Keep Quality' : 'PDF 압축 — 용량 줄이고 품질 유지'}</h1>
      <p>{intro}</p>

      <ul>
        {bullets.map(b => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <p>
        <Link href={`/${params.locale}#compress`} className="inline-block rounded-xl px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white">
          {en ? 'Start compressing' : '지금 압축하기'}
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
