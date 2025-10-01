'use client';

import {useTranslations} from 'next-intl';
import Tabs from '@/components/Tabs';
import MergeTool from '@/components/tools/MergeTool';
import CompressTool from '@/components/tools/CompressTool';
import TableExtractTool from '@/components/tools/TableExtractTool';
import {FilesProvider} from '@/components/files/FilesContext';
import FileTray from '@/components/FileTray';

export default function Home() {
  const t = useTranslations();

  return (
    <main className="container">
      <nav className="nav">
        <div className="brand">
          <span className="brand-dot" />
          <span>PDF Studio</span>
        </div>
        <span className="subtle small">Private. Client-side. Fast.</span>
      </nav>

      <div className="panel card">
        <header style={{marginBottom: 10}}>
          <h1 style={{margin: 0, fontSize: 22, fontWeight: 700}}>{t('app.title')}</h1>
          <p className="subtle" style={{margin: '6px 0 0'}}>{t('app.desc')}</p>
        </header>

        {/* 언제든 먼저 파일 업로드 가능 */}
        <FilesProvider>
          <FileTray />
          <hr className="hr" style={{margin: '16px 0'}} />
          <Tabs
            tabs={[
              {id: 'merge', label: t('tabs.merge'), content: <MergeTool />},
              {id: 'compress', label: t('tabs.compress'), content: <CompressTool />},
              {id: 'tables', label: t('tabs.tables'), content: <TableExtractTool />},
            ]}
          />
        </FilesProvider>
      </div>

      <p className="small" style={{marginTop: 16}}>
        {t('footer.privacy')}
      </p>
    </main>
  );
}
