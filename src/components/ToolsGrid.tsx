// src/app/[locale]/page.tsx
'use client';

import Link from 'next/link';
import {useTranslations, useLocale} from 'next-intl';

import Tabs from '@/components/Tabs';
import MergeTool from '@/components/tools/MergeTool';
import CompressTool from '@/components/tools/CompressTool';
import TableExtractTool from '@/components/tools/TableExtractTool';
import {FilesProvider} from '@/components/files/FilesContext';
import FileTray from '@/components/FileTray';
// import ToolsGrid from '@/components/ToolsGrid'; // 👈 원하면 유지, 지금은 상단 텍스트 링크로 대체

export default function Home() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ko';

  return (
    <main className="container">
      {/* ===== Top Nav ===== */}
      <nav className="nav">
        {/* 좌측 브랜드 */}
        <div className="brand">
          <span className="brand-dot" />
          <span>PDF Studio</span>
        </div>

        {/* 중앙: 매우 은은한 텍스트 링크 3종 */}
        <div className="mx-3 hidden md:block flex-1">
          <div className="flex justify-center">
            <div className="text-sm text-neutral-400">
              <Link
                href={`/${locale}/merge`}
                className="no-underline hover:text-neutral-200 transition-colors"
                aria-label={locale === 'en' ? 'Merge PDF' : 'PDF 합치기'}
              >
                {locale === 'en' ? 'Merge PDF' : 'PDF 합치기'}
              </Link>
              <span className="mx-2">·</span>
              <Link
                href={`/${locale}/compress`}
                className="no-underline hover:text-neutral-200 transition-colors"
                aria-label={locale === 'en' ? 'Compress PDF' : 'PDF 압축'}
              >
                {locale === 'en' ? 'Compress PDF' : 'PDF 압축'}
              </Link>
              <span className="mx-2">·</span>
              <Link
                href={`/${locale}/tables`}
                className="no-underline hover:text-neutral-200 transition-colors"
                aria-label={locale === 'en' ? 'Extract Tables' : '표 추출'}
              >
                {locale === 'en' ? 'Extract Tables' : '표 추출'}
              </Link>
            </div>
          </div>
        </div>

        {/* 우측 슬로건 */}
        <span className="subtle small">Private. Client-side. Fast.</span>
      </nav>

      {/* 모바일에선 링크를 아래 한 줄로 표시 (감추고 싶으면 이 블록 제거) */}
      <div className="md:hidden mt-2 text-center text-sm text-neutral-400">
        <Link href={`/${locale}/merge`} className="no-underline hover:text-neutral-200">{
          locale === 'en' ? 'Merge PDF' : 'PDF 합치기'
        }</Link>
        <span className="mx-2">·</span>
        <Link href={`/${locale}/compress`} className="no-underline hover:text-neutral-200">{
          locale === 'en' ? 'Compress PDF' : 'PDF 압축'
        }</Link>
        <span className="mx-2">·</span>
        <Link href={`/${locale}/tables`} className="no-underline hover:text-neutral-200">{
          locale === 'en' ? 'Extract Tables' : '표 추출'
        }</Link>
      </div>

      {/* ===== Panel ===== */}
      <div className="panel card">
        <header style={{ marginBottom: 10 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{t('app.title')}</h1>
          <p className="subtle" style={{ margin: '6px 0 0' }}>{t('app.desc')}</p>
        </header>

        {/* 필요하면 히어로 아래 카드형 그리드 사용 */}
        {/* <ToolsGrid locale={locale} variant="compact" /> */}

        {/* 언제든 먼저 파일 업로드 가능 */}
        <FilesProvider>
          <FileTray />
          <hr className="hr" style={{ margin: '16px 0' }} />
          <Tabs
            tabs={[
              { id: 'merge', label: t('tabs.merge'), content: <MergeTool /> },
              { id: 'compress', label: t('tabs.compress'), content: <CompressTool /> },
              { id: 'tables', label: t('tabs.tables'), content: <TableExtractTool /> },
            ]}
          />
        </FilesProvider>
      </div>

      <p className="small" style={{ marginTop: 16 }}>
        {t('footer.privacy')}
      </p>
    </main>
  );
}
