const LEGISCAN_BASE = "https://api.legiscan.com/";

export interface LegiscanTextRef {
  doc_id: number;
  type: string;
  type_id: number;
  mime: string;
}

export interface LegiscanBillResult {
  legiscan_bill_id: number;
  state: string;
  bill_number: string;
  title: string;
  status_simple: string;
  status_detail: string;
  date_introduced: string | null;
  last_action_date: string | null;
  last_action_description: string | null;
  legiscan_url: string | null;
  session_end_date: string | null;
  change_hash: string | null;
  session_id: number | null;
  texts: LegiscanTextRef[];
}

export interface MasterListEntry {
  bill_id: number;
  change_hash: string;
}

const STATUS_MAP: Record<number, string> = {
  1: "Introduced",
  2: "Passed One Chamber",
  3: "Passed Both Chambers",
  4: "Signed Into Law",
  5: "Vetoed",
  6: "Failed",
};

export function mapLegiscanStatus(code: number): string | null {
  return STATUS_MAP[code] ?? null;
}

export async function getMasterListRaw(
  apiKey: string,
  sessionId: number
): Promise<MasterListEntry[]> {
  const url = `${LEGISCAN_BASE}?key=${apiKey}&op=getMasterListRaw&id=${sessionId}`;
  const res = await fetch(url);
  const data = await res.json() as Record<string, unknown>;

  if (data.status !== "OK") return [];

  const masterlist = data.masterlist as Record<string, unknown>;
  const entries: MasterListEntry[] = [];

  for (const [key, value] of Object.entries(masterlist)) {
    if (key === "session") continue;
    const entry = value as { bill_id: number; change_hash: string };
    if (entry.bill_id && entry.change_hash) {
      entries.push({ bill_id: entry.bill_id, change_hash: entry.change_hash });
    }
  }

  return entries;
}

// Parse state, bill number, and optional year from a LegiScan URL like:
// https://legiscan.com/AZ/bill/HB2991/2026
export function parseLegiscanUrl(url: string): { state: string; billNumber: string; year?: string } | null {
  const match = url.match(/legiscan\.com\/([A-Z]{2})\/bill\/([^/]+)(?:\/(\d{4}))?/i);
  if (!match) return null;
  return { state: match[1].toUpperCase(), billNumber: match[2], year: match[3] };
}

export async function searchBill(
  apiKey: string,
  state: string,
  billNumber: string,
  year?: string
): Promise<LegiscanBillResult | null> {
  const normalizedBill = billNumber.replace(/\s+/g, "");

  let searchUrl = `${LEGISCAN_BASE}?key=${apiKey}&op=search&state=${state}&bill=${normalizedBill}`;
  if (year) searchUrl += `&year=${year}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json() as Record<string, unknown>;

  if (searchData.status !== "OK") return null;

  const searchResult = searchData.searchresult as Record<string, unknown>;
  const summary = searchResult.summary as { count: number } | undefined;
  if (!summary || summary.count === 0) return null;

  const firstResult = searchResult["0"] as { bill_id: number } | undefined;
  if (!firstResult) return null;

  return await getBillDetails(apiKey, firstResult.bill_id);
}

export async function getBillDetails(
  apiKey: string,
  billId: number
): Promise<LegiscanBillResult | null> {
  const url = `${LEGISCAN_BASE}?key=${apiKey}&op=getBill&id=${billId}`;
  const res = await fetch(url);
  const data = await res.json() as Record<string, unknown>;

  if (data.status !== "OK") return null;

  const bill = data.bill as {
    bill_id: number;
    state: string;
    bill_number: string;
    title: string;
    status: number;
    status_desc: string;
    change_hash?: string;
    url?: string;
    history?: Array<{ date: string; action: string; importance: number }>;
    session?: { session_id?: number; session_title?: string; sine_die?: string; end_date?: string };
    texts?: Array<{ doc_id: number; type: string; type_id: number; mime: string }>;
  };

  const statusSimple = mapLegiscanStatus(bill.status) ?? "Introduced";

  const lastAction = bill.history?.length ? bill.history[bill.history.length - 1] : null;
  const introDate = bill.history?.length ? bill.history[0].date : null;

  const sessionEndDate = bill.session?.sine_die ?? bill.session?.end_date ?? null;

  return {
    legiscan_bill_id: bill.bill_id,
    state: bill.state,
    bill_number: bill.bill_number,
    title: bill.title,
    status_simple: statusSimple,
    status_detail: bill.status_desc,
    date_introduced: introDate,
    last_action_date: lastAction?.date ?? null,
    last_action_description: lastAction?.action ?? null,
    legiscan_url: bill.url ?? null,
    session_end_date: sessionEndDate,
    change_hash: bill.change_hash ?? null,
    session_id: bill.session?.session_id ?? null,
    texts: (bill.texts ?? []).map((t) => ({
      doc_id: t.doc_id,
      type: t.type,
      type_id: t.type_id,
      mime: t.mime,
    })),
  };
}

export async function getBillText(
  apiKey: string,
  docId: number
): Promise<{ doc_id: number; mime: string; base64: string } | null> {
  const url = `${LEGISCAN_BASE}?key=${apiKey}&op=getBillText&id=${docId}`;
  const res = await fetch(url);
  const data = await res.json() as Record<string, unknown>;

  if (data.status !== "OK") return null;

  const text = data.text as {
    doc_id: number;
    mime: string;
    text_size: number;
    doc: string; // Base64 encoded
  };

  return {
    doc_id: text.doc_id,
    mime: text.mime,
    base64: text.doc,
  };
}
