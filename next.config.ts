// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// next-intl 플러그인 래퍼
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // experimental 옵션 필요 시 여기서만 추가
  // experimental: { /* ... */ },
};

// 플러그인 적용한 구성 내보내기
export default withNextIntl(nextConfig);
