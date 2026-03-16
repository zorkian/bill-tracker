import { getBillDetails, getBillText, type LegiscanTextRef } from "./legiscan";

function r2Key(legiscanBillId: number, docId: number, mime: string): string {
  const ext = mime.includes("html") ? "html" : "pdf";
  return `bills/${legiscanBillId}/${docId}.${ext}`;
}

// Pick the best text version: prefer HTML, prefer latest (highest type_id = most progressed version)
function pickBestText(texts: LegiscanTextRef[]): LegiscanTextRef | null {
  if (texts.length === 0) return null;

  // Prefer HTML versions
  const htmlTexts = texts.filter((t) => t.mime.includes("html"));
  const candidates = htmlTexts.length > 0 ? htmlTexts : texts;

  // Pick the one with the highest type_id (most progressed version: enrolled > engrossed > introduced)
  return candidates.reduce((best, t) => (t.type_id > best.type_id ? t : best));
}

export interface BillTextResult {
  doc_id: number;
  mime: string;
  text: string;
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
  // Get available texts if not provided
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
    return {
      doc_id: best.doc_id,
      mime: best.mime,
      text: await cached.text(),
      source: "r2",
      type: best.type,
    };
  }

  // Fetch from LegiScan
  const result = await getBillText(apiKey, best.doc_id);
  if (!result) return null;

  // Store in R2
  await r2.put(key, result.text, {
    customMetadata: {
      legiscan_bill_id: String(legiscanBillId),
      doc_id: String(best.doc_id),
      type: best.type,
      mime: best.mime,
    },
  });

  return {
    doc_id: best.doc_id,
    mime: best.mime,
    text: result.text,
    source: "legiscan",
    type: best.type,
  };
}
