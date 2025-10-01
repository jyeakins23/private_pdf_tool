import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

export async function openPdfWithPassword(
  pdfjsLib: typeof import('pdfjs-dist'),
  data: ArrayBuffer,
  promptText = '이 문서는 비밀번호가 필요합니다. 비밀번호를 입력하세요:'
): Promise<PDFDocumentProxy> {
  try {
    return await pdfjsLib.getDocument({ data }).promise;
  } catch (e) {
    const msg = String((e as Error)?.message || '').toLowerCase();
    const needsPwd =
      msg.includes('password') || msg.includes('encrypted') || msg.includes('needpassword');
    if (!needsPwd) throw e;
    const pwd = typeof window !== 'undefined' ? window.prompt(promptText) : null;
    if (!pwd) throw e;
    return await pdfjsLib.getDocument({ data, password: pwd }).promise;
  }
}
