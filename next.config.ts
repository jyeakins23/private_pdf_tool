// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // ❌ i18n 블록 제거 (App Router 비지원)
  experimental: {},
};

const withNextIntl = createNextIntlPlugin();
export default nextConfig;
