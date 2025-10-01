'use client';

import {useEffect, useRef, useState} from 'react';
import {saveAs} from 'file-saver';
import {useTranslations} from 'next-intl';
import {PDFDocument} from 'pdf-lib';
import {useFiles} from '@/components/files/FilesContext';
import type {PDFDocumentProxy, RenderTask} from 'pdfjs-dist/types/src/display/api';

/** Uint8Array → ArrayBuffer (SharedArrayBuffer 배제) */
function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  if (u8.byteOffset === 0 && u8.byteLength === u8.buffer.byteLength) {
    return u8.buffer as ArrayBuffer;
  }
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer;
}

/** 비밀번호 문서 열기: 필요 시 prompt */
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

export default function CompressTool() {
  const t = useTranslations();
  const {files, activeIndex} = useFiles();
  const file = activeIndex !== null ? files[activeIndex] : null;

  const [quality, setQuality] = useState(0.7);
  const [busy, setBusy] = useState(false);

  // pdf.js를 클라이언트에서만 로드(SSR에서 DOMMatrix 오류 방지)
  const pdfjsRef = useRef<null | (typeof import('pdfjs-dist'))>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === 'undefined') return;
      const mod = await import('pdfjs-dist');
      mod.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'; // public/
      if (mounted) pdfjsRef.current = mod;
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function ensurePdfJs(): Promise<typeof import('pdfjs-dist')> {
    if (!pdfjsRef.current) {
      const mod = await import('pdfjs-dist');
      mod.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      pdfjsRef.current = mod;
    }
    return pdfjsRef.current;
  }

  async function compress() {
    if (!file) return;
    setBusy(true);
    try {
      const pdfjsLib = await ensurePdfJs();
      const data = await file.arrayBuffer();

      // 암호 문서(사용자 비번) 처리
      const srcDoc = await openPdfWithPassword(pdfjsLib, data);

      const out = await PDFDocument.create();

      for (let i = 1; i <= srcDoc.numPages; i++) {
        const page = await srcDoc.getPage(i);

        // getViewport 결과에서 우리가 쓰는 건 width/height 뿐
        const viewport = page.getViewport({ scale: 2 }) as unknown as { width: number; height: number };

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2d context not available');

        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));

        // page.render 인자 타입을 안전하게 지정
        const params = { canvasContext: ctx, viewport } as unknown as Parameters<typeof page.render>[0];
        const renderTask: RenderTask = page.render(params);
        await renderTask.promise;

        const jpgBytes = await new Promise<ArrayBuffer>((resolve) => {
          canvas.toBlob(
            (b) => b?.arrayBuffer().then(resolve),
            'image/jpeg',
            quality
          );
        });

        const img = await out.embedJpg(new Uint8Array(jpgBytes));
        const p = out.addPage([canvas.width, canvas.height]);
        p.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height });
      }

      const bytes = await out.save({ useObjectStreams: true }); // Uint8Array
      const ab = toArrayBuffer(bytes);
      const blob = new Blob([ab], { type: 'application/pdf' });

      const nameBase = file.name.replace(/\.pdf$/i, '');
      saveAs(blob, `${nameBase}.compressed.pdf`);
    } catch (err) {
      console.error(err);
      alert(
        t('tabs.compress') === 'Compress'
          ? 'Compression failed. Try another file or lower the quality.'
          : '압축에 실패했습니다. 다른 파일로 시도하거나 품질을 낮춰 보세요.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <p className="small">
        {file
          ? `${file.name} · ${Math.round(file.size / 1024)} KB`
          : t('tabs.compress') === 'Compress'
            ? 'Select a file above.'
            : '위에서 파일을 선택하세요.'}
      </p>

      <div className="input-row" style={{ marginTop: 12 }}>
        <label className="small" style={{ minWidth: 60 }}>{t('compress.quality')}</label>
        <input
          type="range"
          min={0.3}
          max={0.95}
          step={0.05}
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span className="small" style={{ minWidth: 42, textAlign: 'right' }}>
          {Math.round(quality * 100)}%
        </span>
      </div>

      <button
        className="btn btn-primary"
        disabled={!file || busy}
        onClick={compress}
        style={{ marginTop: 12 }}
      >
        {busy ? (t('tabs.compress') === 'Compress' ? 'Compressing…' : '압축 중…') : t('compress.action')}
      </button>
    </section>
  );
}
