'use client';

import {useEffect, useRef, useState} from 'react';
import {saveAs} from 'file-saver';
import {useTranslations} from 'next-intl';
import {useFiles} from '@/components/files/FilesContext';
import type {
  PDFDocumentProxy,
  TextContent,
  TextItem
} from 'pdfjs-dist/types/src/display/api';

function toCSV(rows: string[][]): string {
  return rows.map(r =>
    r.map(v => `"${(v ?? '').replaceAll('"', '""')}"`).join(',')
  ).join('\n');
}

export default function TableExtractTool() {
  const t = useTranslations();
  const {files, activeIndex} = useFiles();
  const file = activeIndex !== null ? files[activeIndex] : null;
  const [busy, setBusy] = useState(false);

  // pdf.js 를 클라이언트에서만 로드
  const pdfjsRef = useRef<null | (typeof import('pdfjs-dist'))>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === 'undefined') return;
      const mod = await import('pdfjs-dist');
      mod.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      if (mounted) pdfjsRef.current = mod;
    })();
    return () => { mounted = false; };
  }, []);

  async function ensurePdfJs(): Promise<typeof import('pdfjs-dist')> {
    if (!pdfjsRef.current) {
      const mod = await import('pdfjs-dist');
      mod.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      pdfjsRef.current = mod;
    }
    return pdfjsRef.current;
  }

  async function openPdfWithPassword(
    pdfjsLib: typeof import('pdfjs-dist'),
    data: ArrayBuffer
  ): Promise<PDFDocumentProxy> {
    try {
      return await pdfjsLib.getDocument({ data }).promise;
    } catch (e) {
      const msg = String((e as Error)?.message || '').toLowerCase();
      const needsPwd =
        msg.includes('password') || msg.includes('encrypted') || msg.includes('needpassword');
      if (!needsPwd) throw e;
      const pwd =
        typeof window !== 'undefined'
          ? window.prompt('이 문서는 비밀번호가 필요합니다. 비밀번호를 입력하세요:')
          : null;
      if (!pwd) throw e;
      return await pdfjsLib.getDocument({ data, password: pwd }).promise;
    }
  }

  // 간단 휴리스틱 표 추출
  async function extractTablesFromPDF(data: ArrayBuffer): Promise<string[][]> {
    const pdfjsLib = await ensurePdfJs();
    const doc = await openPdfWithPassword(pdfjsLib, data);

    const allRows: string[][] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content: TextContent = await page.getTextContent();
      const items = content.items as TextItem[];

      type Span = { str: string; x: number; y: number };
      const spans: Span[] = items.map((it) => ({
        str: it.str,
        x: (it.transform?.[4] as number) ?? 0,
        y: (it.transform?.[5] as number) ?? 0
      }));

      // 같은 y 라인을 묶기
      const yTolerance = 3;
      spans.sort((a, b) => b.y - a.y || a.x - b.x);

      const lines: Span[][] = [];
      for (const s of spans) {
        const line = lines.find((l) => Math.abs(l[0].y - s.y) <= yTolerance);
        if (line) line.push(s);
        else lines.push([s]);
      }

      // 각 라인에서 x 간격으로 셀 분리
      for (const line of lines) {
        line.sort((a, b) => a.x - b.x);

        const diffs: number[] = [];
        for (let j = 1; j < line.length; j++) diffs.push(line[j].x - line[j - 1].x);
        const medianGap = diffs.length
          ? diffs.sort((a, b) => a - b)[Math.floor(diffs.length / 2)]
          : 8;
        const gapThreshold = Math.max(12, medianGap * 1.8);

        const cells: string[] = [];
        let buf = '';

        for (let j = 0; j < line.length; j++) {
          const cur = line[j];
          const prev = line[j - 1];

          if (j > 0 && prev) {
            const gap = cur.x - prev.x;
            if (gap > gapThreshold) {
              cells.push(buf.trim());
              buf = cur.str;
              continue;
            }
          }
          buf += (buf ? ' ' : '') + cur.str;
        }
        if (buf) cells.push(buf.trim());

        if (cells.filter(c => c.length).length >= 2) {
          allRows.push(cells);
        }
      }
    }

    return allRows;
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    try {
      const rows = await extractTablesFromPDF(await file.arrayBuffer());
      const csv = toCSV(rows);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'tables.csv');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <p className="small">
        {file ? `${file.name}` : (t('tabs.tables') === 'Table Extract' ? 'Select a file above.' : '위에서 파일을 선택하세요.')}
      </p>
      <button
        disabled={!file || busy}
        onClick={run}
        className="btn btn-primary"
        style={{ marginTop: 12 }}
      >
        {busy ? 'Processing…' : t('tables.action')}
      </button>
    </section>
  );
}
