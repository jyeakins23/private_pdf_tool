export default function Privacy() {
  return (
    <main className="container">
      <h1 style={{fontSize:22, fontWeight:700, marginBottom:8}}>Privacy Policy</h1>
      <p className="small">Files never leave your device. All processing happens locally in your browser.</p>
      <ul className="list">
        <li>No uploads, no tracking cookies (if you use Plausible below).</li>
        <li>Service Worker caches only app assets for speed/offline.</li>
        <li>No file contents are sent to any server.</li>
        <li>Questions? contact: help@securepdftool.com</li>
      </ul>
    </main>
  );
}
