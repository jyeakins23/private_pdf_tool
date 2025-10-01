// src/components/Analytics.tsx
'use client';

import {useEffect} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {pageview} from '@/lib/gtag';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = searchParams?.toString() ? `${pathname}?${searchParams}` : pathname;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
