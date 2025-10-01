'use client';

import React, {useRef, useState, DragEvent} from 'react';
import {useTranslations} from 'next-intl';

type DropZoneProps = {
  multiple?: boolean;
  accept?: string | string[];
  onFiles: (files: File[]) => void;
  className?: string;
};

function normalizeAccept(accept?: string | string[]) {
  if (!accept) return undefined;
  return Array.isArray(accept) ? accept : accept.split(',').map(s => s.trim());
}

export default function DropZone({ multiple=false, accept='application/pdf', onFiles, className='' }: DropZoneProps) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const accepts = normalizeAccept(accept);

  function filterByAccept(files: File[]) {
    if (!accepts) return files;
    return files.filter(file => {
      if (file.type && accepts.includes(file.type)) return true;
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (accepts.includes('application/pdf') && ext === 'pdf') return true;
      return false;
    });
  }

  function openPicker(){ inputRef.current?.click(); }
  function onDragOver(e: DragEvent){ e.preventDefault(); if(!isDragging) setIsDragging(true); }
  function onDragLeave(e: DragEvent){ if(e.currentTarget===e.target) setIsDragging(false); }
  function onDrop(e: DragEvent){ e.preventDefault(); setIsDragging(false);
    const filtered = filterByAccept(Array.from(e.dataTransfer.files));
    onFiles(multiple ? filtered : filtered.slice(0,1));
  }
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>){
    const filtered = filterByAccept(Array.from(e.target.files ?? []));
    onFiles(multiple ? filtered : filtered.slice(0,1));
    e.currentTarget.value = '';
  }

  return (
    <div
      role="button" tabIndex={0} onClick={openPicker}
      onKeyDown={(e)=> (e.key==='Enter'||e.key===' ') && openPicker()}
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      className={`drop ${isDragging ? 'drag' : ''} ${className}`}
      aria-label={t('drop.hint')}
    >
      <div className="badge" style={{marginBottom:10}}>
        <span>PDF</span><span>local-only</span>
      </div>
      <div style={{fontSize:16, fontWeight:700, marginBottom:6}}>
        {t('drop.hint')}
      </div>
      <div className="subtle small">Or click to choose</div>

      <input
        ref={inputRef} type="file"
        accept={Array.isArray(accept) ? accept.join(',') : accept}
        multiple={multiple} style={{display:'none'}}
        onChange={onInputChange} aria-hidden="true"
      />
    </div>
  );
}
