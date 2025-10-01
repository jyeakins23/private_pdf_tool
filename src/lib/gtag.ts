// src/lib/gtag.ts
export const GA_ID: string = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

type GtagFunction = (...args: unknown[]) => void;
type DataLayer = unknown[];
type GAParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: DataLayer;
  }
}

/** 페이지뷰 전송 */
export function pageview(url: string): void {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('config', GA_ID, { page_path: url });
}

/** 커스텀 이벤트 전송 */
export function gaEvent(action: string, params?: GAParams): void {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', action, params ?? {});
}
