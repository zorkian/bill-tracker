import { getBillDetails, getBillText, type LegiscanTextRef } from "./legiscan";

function r2Key(legiscanBillId: number, docId: number, mime: string): string {
  const ext = mime.includes("html") ? "html" : "pdf";
  return `bills/${legiscanBillId}/${docId}.${ext}`;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

// Pick the best text version: prefer HTML, prefer latest (highest type_id)
function pickBestText(texts: LegiscanTextRef[]): LegiscanTextRef | null {
  if (texts.length === 0) return null;

  // Prefer HTML versions
  const htmlTexts = texts.filter((t) => t.mime.includes("html"));
  const candidates = htmlTexts.length > 0 ? htmlTexts : texts;

  // Pick the one with the highest type_id (most progressed version)
  return candidates.reduce((best, t) => (t.type_id > best.type_id ? t : best));
}

export interface BillTextResult {
  doc_id: number;
  mime: string;
  base64: string;     // always base64 — sent directly to Claude as document block
  source: "r2" | "legiscan";
  type: string;
}

// Fetch bill text: check R2 cache first, fall back to LegiScan API, store in R2
export async function fetchBillText(
  r2: R2Bucket,
  apiKey: string,
  legiscanBillId: number,
  options?: { texts?: LegiscanTextRef[] }
): Promise<BillTextResult | null> {
  let texts = options?.texts;
  if (!texts) {
    const details = await getBillDetails(apiKey, legiscanBillId);
    if (!details) return null;
    texts = details.texts;
  }

  const best = pickBestText(texts);
  if (!best) return null;

  const key = r2Key(legiscanBillId, best.doc_id, best.mime);

  // Check R2 cache
  const cached = await r2.get(key);
  if (cached) {
    const bytes = new Uint8Array(await cached.arrayBuffer());
    return {
      doc_id: best.doc_id,
      mime: best.mime,
      base64: bytesToBase64(bytes),
      source: "r2",
      type: best.type,
    };
  }

  // Fetch from LegiScan (already base64)
  const result = await getBillText(apiKey, best.doc_id);
  if (!result) return null;

  // Store raw bytes in R2
  const bytes = base64ToBytes(result.base64);
  const contentType = best.mime.includes("html") ? "text/html" : "application/pdf";
  await r2.put(key, bytes, {
    httpMetadata: { contentType },
    customMetadata: {
      legiscan_bill_id: String(legiscanBillId),
      doc_id: String(best.doc_id),
      type: best.type,
    },
  });

  return {
    doc_id: best.doc_id,
    mime: best.mime,
    base64: result.base64,
    source: "legiscan",
    type: best.type,
  };
}
