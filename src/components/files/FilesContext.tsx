'use client';

import React, {createContext, useContext, useState} from 'react';

export type FilesContextValue = {
  files: File[];
  activeIndex: number | null;            // 단일 파일을 쓰는 도구(Compress/Table)를 위한 선택 인덱스
  addFiles: (newFiles: File[]) => void;  // 누적 추가
  removeAt: (idx: number) => void;
  clearAll: () => void;
  setActiveIndex: (idx: number | null) => void;
  reorder: (from: number, to: number) => void;
};

const FilesContext = createContext<FilesContextValue | null>(null);

export function FilesProvider({children}: {children: React.ReactNode}) {
  const [files, setFiles] = useState<File[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const addFiles = (newFiles: File[]) => {
    setFiles(prev => {
      // 파일명 기준 중복 제거(간단)
      const map = new Map(prev.map(f => [f.name, f]));
      newFiles.forEach(f => map.set(f.name, f));
      const arr = Array.from(map.values());
      // 기존에 선택된게 없으면 첫 파일을 선택
      if (arr.length > 0 && activeIndex === null) setActiveIndex(0);
      return arr;
    });
  };
  
  const reorder = (from: number, to: number) => {
  setFiles(prev => {
    const next = prev.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  });
  setActiveIndex(i => {
    if (i === null) return i;
    if (i === from) return to;
    if (from < i && i <= to) return i - 1;
    if (to <= i && i < from) return i + 1;
    return i;
  });
};

  const removeAt = (idx: number) => {
    setFiles(prev => {
      const next = prev.filter((_, i) => i !== idx);
      // activeIndex 보정
      if (next.length === 0) setActiveIndex(null);
      else if (idx === activeIndex) setActiveIndex(0);
      else if (activeIndex !== null && idx < activeIndex) setActiveIndex(activeIndex - 1);
      return next;
    });
  };

  const clearAll = () => {
    setFiles([]);
    setActiveIndex(null);
  };

  return (
    <FilesContext.Provider value={{files, activeIndex, addFiles, removeAt, clearAll, setActiveIndex, reorder}}>
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles() {
  const ctx = useContext(FilesContext);
  if (!ctx) throw new Error('useFiles must be used within FilesProvider');
  return ctx;
}
