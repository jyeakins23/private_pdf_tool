// i18n/routing.ts
export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';
export const localePrefix = 'always' as const; // URL에 항상 /en, /ko
