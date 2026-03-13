const LEGISCAN_BASE = "https://api.legiscan.com/";

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
}

const STATUS_MAP: Record<number, string> = {
  1: "Introduced",
  2: "Passed One Chamber",
  3: "Passed Both Chambers",
  4: "Passed Both Chambers",
  5: "Vetoed",
  6: "Failed",
};

export function mapLegiscanStatus(code: number): string | null {
  return STATUS_MAP[code] ?? null;
}

export async function searchBill(
  apiKey: string,
  state: string,
  billNumber: string
): Promise<LegiscanBillResult | null> {
  const normalizedBill = billNumber.replace(/\s+/g, "");

  const searchUrl = `${LEGISCAN_BASE}?key=${apiKey}&op=search&state=${state}&bill=${normalizedBill}`;
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
    url?: string;
    history?: Array<{ date: string; action: string; importance: number; type_id?: number }>;
    session?: { session_title?: string; sine_die?: string; end_date?: string };
  };

  const signed = bill.history?.some((h) => h.type_id === 28);
  const statusSimple = signed ? "Signed Into Law" : (mapLegiscanStatus(bill.status) ?? "Introduced");

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
  };
}
