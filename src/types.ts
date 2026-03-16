export interface Bindings {
  DB: D1Database;
  SESSIONS: KVNamespace;
  BILL_TEXTS: R2Bucket;
  LEGISCAN_API_KEY: string;
  ANTHROPIC_API_KEY: string;
}

export interface Bill {
  id: number;
  state: string;
  bill_number: string;
  title: string | null;
  legiscan_bill_id: number | null;
  legiscan_url: string | null;
  status_simple: string;
  status_detail: string | null;
  date_introduced: string | null;
  last_action_date: string | null;
  last_action_description: string | null;
  session_end_date: string | null;
  social_media_definition: string | null;
  notes: string | null;
  change_hash: string | null;
  legiscan_session_id: number | null;
  urgent: number;
  enforcement_status: string | null;
  lawsuit_citation: string | null;
  recap_docket_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BillWithCategories extends Bill {
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  sort_order: number;
}

export interface User {
  id: number;
  username: string;
  email: string | null;
  password_hash: string;
  role: string;
  created_at: string;
}

export type StatusSimple =
  | "Introduced"
  | "Passed One Chamber"
  | "Passed Both Chambers"
  | "Signed Into Law"
  | "Vetoed"
  | "Failed";

export type EnforcementStatus =
  | "In Effect"
  | "Enjoined"
  | "Ruled Unconstitutional";
