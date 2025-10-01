'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {PDFDocument} from 'pdf-lib';
import {saveAs} from 'file-saver';
import {useFiles} from '@/components/files/FilesContext';

/** Uint8Array → ArrayBuffer (SharedArrayBuffer 배제) */
function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  if (u8.byteOffset === 0 && u8.byteLength === u8.buffer.byteLength) {
    return u8.buffer as ArrayBuffer;
  }
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer;
}

export default function MergeTool() {
  const t = useTranslations();
  const {files} = useFiles();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // 안내 로그 등 필요시 여기에
  }, []);

  async function merge() {
    if (files.length < 2 || busy) return;
    setBusy(true);
    try {
      const out = await PDFDocument.create();

      for (const f of files) {
        const bytes = new Uint8Array(await f.arrayBuffer());
        // 소유자 암호(permissions)만 있는 경우 통과
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach(p => out.addPage(p));
      }

      const result = await out.save({ addDefaultPage: false, useObjectStreams: true });
      const ab = toArrayBuffer(result);
      const blob = new Blob([ab], { type: 'application/pdf' });

      saveAs(blob, 'merged.pdf');
    } catch (err) {
      console.error(err);
      alert(
        t('tabs.merge') === 'Merge'
          ? 'Merging failed. A password-protected PDF might be included.'
          : '병합에 실패했습니다. 비밀번호가 걸린 PDF가 포함되었을 수 있습니다.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <p className="small">
        {files.length} {t('tabs.merge') === 'Merge' ? 'file(s) selected.' : '개 파일 선택됨.'}
      </p>

      <ul className="list" style={{marginTop: 6}}>
        {files.map((f, i) => (
          <li key={f.name} style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={{opacity:.7, width:18}}>{i+1}.</span>
            <span style={{flex:1}}>{f.name}</span>
          </li>
        ))}
      </ul>

      <button
        disabled={busy || files.length < 2}
        onClick={merge}
        className="btn btn-primary"
        style={{marginTop:12}}
      >
        {busy ? (t('tabs.merge') === 'Merge' ? 'Merging…' : '병합 중…') : t('merge.action')}
      </button>
    </section>
  );
}
