// src/app/[locale]/tables/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: 'en' | 'ko' } }): Promise<Metadata> {
  const en = params.locale === 'en';
  return {
    title: en ? 'Extract Tables from PDF — to CSV' : 'PDF 표 추출 — CSV로 내보내기',
    description: en
      ? 'Parse tables from PDFs in your browser and export to CSV. No uploads, perfect for receipts and reports.'
      : '브라우저에서 PDF 표를 추출해 CSV로 내보내세요. 업로드가 필요 없어 영수증·리포트 처리에 적합합니다.',
    alternates: {
      languages: {
        en: 'https://securepdftool.com/en/tables',
        ko: 'https://securepdftool.com/ko/tables'
      }
    }
  };
}

export default function Page({ params }: { params: { locale: 'en' | 'ko' } }) {
  const en = params.locale === 'en';

  const intro = en
    ? 'Detect and extract tables without sending files anywhere. Preview detected grids, fix boundaries, and download clean CSV files ready for spreadsheets or analysis.'
    : '파일을 어디에도 보내지 않고 표를 감지·추출합니다. 감지된 격자를 미리 보고 경계를 보정한 뒤 스프레드시트·분석용으로 깔끔한 CSV를 받을 수 있습니다.';

  const bullets = en
    ? ['Local parsing in your browser', 'Preview & adjust table regions', 'Export to CSV', 'Great for receipts/reports']
    : ['브라우저 로컬 파싱', '표 영역 미리보기·보정', 'CSV로 내보내기', '영수증/리포트에 적합'];

  const faqs = [
    en
      ? {
          q: 'Does it work offline?',
          a: 'Yes. Once loaded, you can parse tables offline as a PWA.'
        }
      : {
          q: '오프라인에서도 되나요?',
          a: '가능합니다. 한 번 로드한 후에는 PWA로 오프라인에서도 표 추출이 가능합니다.'
        },
    en
      ? {
          q: 'Are complex tables supported?',
          a: 'It handles most simple to moderately complex grids; you can refine regions before exporting.'
        }
      : {
          q: '복잡한 표도 추출되나요?',
          a: '단순~중간 복잡도의 표를 지원하며, 내보내기 전에 영역을 직접 보정할 수 있습니다.'
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
      <h1>{en ? 'Extract Tables from PDF — to CSV' : 'PDF 표 추출 — CSV로 내보내기'}</h1>
      <p>{intro}</p>

      <ul>
        {bullets.map(b => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <p>
        <Link href={`/${params.locale}#tables`} className="inline-block rounded-xl px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white">
          {en ? 'Start extracting' : '지금 추출하기'}
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
