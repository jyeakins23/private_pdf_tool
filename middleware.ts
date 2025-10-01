// middleware.ts
import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale, localePrefix} from './i18n/routing';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix
});

export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)|api|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
};
