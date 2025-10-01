// middleware.ts
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

// 확장자가 있는 정적 파일은 전부 제외 (.webmanifest 포함!)
const PUBLIC_FILE = /\.(?:ico|png|jpg|jpeg|svg|gif|webp|avif|js|css|map|txt|xml|json|webmanifest|wasm)$/i;

export function middleware(req: NextRequest) {
  const {pathname, search} = req.nextUrl;

  // 명시적으로 제외: 매니페스트/서비스워커/아이콘/Next 정적
  if (
    pathname === '/manifest.webmanifest' ||
    pathname === '/sw.js' ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/_next/')
  ) {
    return NextResponse.next();
  }

  // 확장자 가진 정적 파일은 전부 패스
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // 이미 /en 또는 /ko 로케일이 붙어 있으면 통과
  if (pathname.startsWith('/en') || pathname.startsWith('/ko')) {
    return NextResponse.next();
  }

  // 여기서만 로케일 감지 후 프리픽스 부여
  // (간단히 영어 기본값, 필요시 Accept-Language 로 개선)
  const locale = 'en';
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

// ✅ 미들웨어가 적용될 경로를 축소: _next, icons, 확장자(.xxx)는 제외
export const config = {
  matcher: ['/((?!_next|api|icons|.*\\..*).*)'],
};
