// src/app/[locale]/privacy/page.tsx
// (server component: 'use client' 없음)

export default function PrivacyPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const source = searchParams.source ?? 'direct';
  return (
    <main>
      <h1>Privacy</h1>
      <p>utm/source: {Array.isArray(source) ? source[0] : source}</p>
    </main>
  );
}
