# PDF Studio — Private PDF Tools (Merge · Compress · Table Extract)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjyeakins23%2Fprivate_pdf_tool.git&project-name=pdf-studio&repository-name=private_pdf_tool)
[![CI](https://github.com/jyeakins23/private_pdf_tool/actions/workflows/ci.yml/badge.svg)](https://github.com/jyeakins23/private_pdf_tool/actions/workflows/ci.yml)

> **No uploads. No tracking. Runs entirely in your browser.**  
> Next.js + pdf.js + pdf-lib + WebAssembly-friendly architecture (client-side heavy, near-zero server cost)

---

## ✨ Highlights

- **Merge PDFs** (multi-file, re-orderable)
- **Compress PDFs** (per-page rasterization with quality control)
- **Extract Tables** (text heuristics; Tabula-WASM ready)
- **Privacy-first**: Files never leave your device
- **PWA**: Offline-capable, installable
- **i18n**: English/Korean auto-detect via middleware

---

## 🧱 Tech Stack

- **Next.js (App Router)**, TypeScript
- **pdf.js** (`pdfjs-dist`) for rendering/extraction
- **pdf-lib** for composing PDFs
- **Service Worker** (`public/sw.js`), **Web App Manifest**
- **next-intl** for i18n
- Minimal CSS tokens in `globals.css` (dark, modern)

---

## ▶️ Quick Start (Local)

```bash
# clone
git clone https://github.com/jyeakins23/private_pdf_tool.git
cd private_pdf_tool

# deps
npm ci

# (once) copy pdf.js worker into public/
mkdir public 2> NUL
copy node_modules\pdfjs-dist\build\pdf.worker.min.mjs public\pdf.worker.min.mjs

# dev
npm run dev
# http://localhost:3000
```

**Build & run prod**
```bash
npm run build
npm run start
```

---

## 📦 Scripts

| Script            | Description                           |
|-------------------|---------------------------------------|
| `dev`             | Start Next dev server                 |
| `build`           | Production build                      |
| `start`           | Start production server               |
| `lint`            | ESLint (TS/React rules)               |
| `postbuild`*      | (optional) sitemap generation         |

> To auto-copy the worker on install:
> ```json
> {
>   "scripts": {
>     "postinstall": "cpx node_modules/pdfjs-dist/build/pdf.worker.min.mjs public"
>   },
>   "devDependencies": { "cpx": "^1.5.0" }
> }
> ```

---

## 🌐 i18n

- Routes: `/{locale}` (`/en`, `/ko`)
- Auto-detect locale via middleware redirect
- Messages: `src/i18n/messages/{en,ko}.json`

---

## 📱 PWA

- `public/manifest.webmanifest`
- `public/sw.js`  
  - CacheFirst for `pdf.worker.min.mjs`  
  - SWR for `/_next`, `/icons`  
  - NetworkFirst fallback for docs
- Registration: `src/components/ServiceWorker.tsx` (included in layout)

**Verify:** Chrome DevTools → Application → *Service Workers*

---

## 🔒 Privacy

- All processing happens **locally in the browser**
- No uploads, no server storage
- Privacy page: `/en/privacy`, `/ko/privacy`

---

## 🗺️ SEO & Social

- `metadata` in `layout.tsx` (title/description/OG/Twitter)
- Place `/public/og.png` (1200×630)
- Optional: `next-sitemap` for sitemap/robots

---

## 🚀 Deploy

### Vercel (recommended)

1. Connect GitHub repo
2. Click the button:  
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjyeakins23%2Fprivate_pdf_tool.git&project-name=pdf-studio&repository-name=private_pdf_tool)
3. Add domain → HTTPS & CDN auto

**Caching headers** (optional, `vercel.json`)
```json
{
  "headers": [
    { "source": "/pdf.worker.min.mjs", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/icons/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

---

## 🧪 CI

GitHub Actions: `.github/workflows/ci.yml`  
- Install → Typecheck/Lint → Build

```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint --if-present
      - run: npm run build
```

---

## 🧩 Project Structure (excerpt)

```
src/
  app/
    [locale]/
      layout.tsx
      page.tsx
      privacy/page.tsx
  components/
    DropZone.tsx
    FileTray.tsx
    ServiceWorker.tsx
    files/FilesContext.tsx
    tools/
      MergeTool.tsx
      CompressTool.tsx
      TableExtractTool.tsx
  i18n/
    messages/en.json
    messages/ko.json
  lib/
    pdf/openWithPassword.ts   (optional util)
public/
  pdf.worker.min.mjs
  manifest.webmanifest
  sw.js
  icons/
    icon-192.png
    icon-512.png
```

---

## 🧯 Troubleshooting

- **SW install fails (`addAll`)** → Precache only static files (no HTML routes)
- **`Response body is already used`** → Cache `response.clone()` once; cache only GET/200/basic
- **`DOMMatrix is not defined`** → Load `pdfjs-dist` *dynamically* on client
- **Encrypted PDF**  
  - Merge: `PDFDocument.load(..., { ignoreEncryption: true })`  
  - Compress/Table: prompt for password via pdf.js
- **Blob type errors** → Convert `Uint8Array` using `toArrayBuffer` before `new Blob(...)`

---

## 📜 License

MIT. Files never leave users’ devices.
