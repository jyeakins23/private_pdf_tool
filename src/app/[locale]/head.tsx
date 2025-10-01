import { useLocale } from 'next-intl'


export default function Head(){
const locale = useLocale()
const title = locale==='ko' ? '개인정보 유출 없는 PDF 도구 — 합치기·압축·표 추출' : 'Private PDF Tools — Merge · Compress · Table Extract'
const desc = locale==='ko' ? '무료·업로드 없음·브라우저에서 실행. PDF 합치기, 압축, 표 추출을 한 번에.' : 'Free, no uploads, runs in your browser. Merge, compress and extract tables from PDFs.'
return (
<>
<title>{title}</title>
<meta name="description" content={desc} />
<meta name="keywords" content={locale==='ko' ? 'pdf 합치기,pdf 압축,표 추출,클라이언트,개인정보' : 'pdf merge,pdf compress,table extract,client-side,privacy'} />
<meta property="og:title" content={title} />
<meta property="og:description" content={desc} />
<meta property="og:type" content="website" />
<link rel="alternate" hrefLang="en" href="/en" />
<link rel="alternate" hrefLang="ko" href="/ko" />
<link rel="alternate" hrefLang="x-default" href="/en" />
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#5b9cff" />
</>
)
}