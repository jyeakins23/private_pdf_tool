// src/app/[locale]/merge/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: 'en' | 'ko' } }): Promise<Metadata> {
  const en = params.locale === 'en';
  return {
    title: en ? 'Merge PDF — Free & Private' : 'PDF 합치기 — 무료 · 로컬 처리',
    description: en
      ? 'Combine multiple PDFs instantly in your browser. No uploads, privacy-first, and lightning fast.'
      : '여러 PDF를 브라우저에서 즉시 하나로 합치세요. 업로드 없이 로컬 처리로 빠르고 안전합니다.',
    alternates: {
      languages: {
        en: 'https://securepdftool.com/en/merge',
        ko: 'https://securepdftool.com/ko/merge'
      }
    }
  };
}

export default function Page({ params }: { params: { locale: 'en' | 'ko' } }) {
  const en = params.locale === 'en';

  const intro = en
    ? 'Merge PDFs securely on your device. Drag and drop, reorder pages, and export a clean, compact file. No files ever leave your browser—ideal for work documents, contracts, and receipts.'
    : 'PDF를 기기에서 안전하게 합치세요. 드래그앤드롭으로 정렬하고 깔끔하고 가벼운 파일로 내보낼 수 있습니다. 모든 처리는 브라우저 로컬에서 이루어져 문서·계약서·영수증에 안성맞춤입니다.';

  const bullets = en
    ? ['Local processing · No uploads', 'Fast merging & clean output', 'Keeps text selectable', 'Works offline (PWA)']
    : ['로컬 처리 · 업로드 없음', '빠른 합치기 & 깔끔한 출력', '텍스트 선택 가능 유지', '오프라인(PWA) 지원'];

  const faqs = [
    en
      ? {
          q: 'Are my PDFs uploaded to a server?',
          a: 'No. All merging happens locally in your browser for maximum privacy.'
        }
      : {
          q: 'PDF가 서버로 업로드되나요?',
          a: '아니요. 모든 합치기 작업은 브라우저 로컬에서 수행되어 개인정보가 안전합니다.'
        },
    en
      ? {
          q: 'Will the text remain selectable?',
          a: 'Yes. We keep text layers wherever possible so your merged file is still searchable.'
        }
      : {
          q: '합친 후에도 텍스트 선택이 되나요?',
          a: '가능합니다. 텍스트 레이어를 최대한 보존해 검색과 선택이 가능합니다.'
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
      <h1>{en ? 'Merge PDF — Free & Private' : 'PDF 합치기 — 무료 · 로컬 처리'}</h1>
      <p>{intro}</p>

      <ul>
        {bullets.map(b => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <p>
        <Link href={`/${params.locale}#merge`} className="inline-block rounded-xl px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white">
          {en ? 'Start merging' : '지금 합치기'}
        </Link>
      </p>

      {/* FAQ 구조화 데이터 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
