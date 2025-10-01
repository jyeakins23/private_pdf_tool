'use client';

import {useFiles} from './files/FilesContext';
import DropZone from './DropZone';
import {useTranslations} from 'next-intl';

export default function FileTray() {
  const t = useTranslations();
  const {files, activeIndex, addFiles, removeAt, clearAll, setActiveIndex} = useFiles();

  return (
    <section>
      <DropZone multiple onFiles={addFiles} className="drop-root" />

      {files.length > 0 && (
        <div className="filetray">
          <div className="small" style={{marginBottom: 8}}>
            {files.length} {t('tabs.merge') === 'Merge' ? 'file(s) added' : '개 추가됨'}
          </div>
          {files.map((f, i) => (
            <div key={f.name} className="file-row">
              <input
                className="radio"
                type="radio"
                name="active-file"
                title="Use for single-file tools"
                checked={activeIndex === i}
                onChange={() => setActiveIndex(i)}
              />
              <div style={{flex:1}}>
                <div style={{fontSize:13}}>{f.name}</div>
                <div className="small">{Math.round(f.size/1024)} KB</div>
              </div>
              <button className="btn" onClick={() => removeAt(i)}>
                {t('tabs.merge') === 'Merge' ? 'Remove' : '삭제'}
              </button>
            </div>
          ))}
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <span className="tag">Merge uses all files</span>
            <span className="tag">Compress/Table use selected</span>
            <div style={{flex:1}} />
            <button className="btn" onClick={clearAll}>
              {t('tabs.merge') === 'Merge' ? 'Clear all' : '모두 지우기'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
