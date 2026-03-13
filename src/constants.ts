import type { StatusSimple } from "./types";

export const STATUS_COLORS: Record<StatusSimple, { bg: string; text: string; border: string }> = {
  "Introduced": { bg: "#dbeafe", text: "#1d4ed8", border: "#2563eb" },
  "Passed One Chamber": { bg: "#dbeafe", text: "#1d4ed8", border: "#2563eb" },
  "Passed Both Chambers": { bg: "#dbeafe", text: "#1d4ed8", border: "#2563eb" },
  "Signed Into Law": { bg: "#dcfce7", text: "#15803d", border: "#16a34a" },
  "Vetoed": { bg: "#fee2e2", text: "#dc2626", border: "#dc2626" },
  "Failed": { bg: "#fee2e2", text: "#dc2626", border: "#dc2626" },
};

export const STATE_NAMES: Record<string, string> = {
  US: "Federal", AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
  CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
  DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii",
  ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
  KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin",
  WY: "Wyoming",
};

export const STATES = ["US", ...Object.keys(STATE_NAMES).filter(s => s !== "US").sort()];

export const STATUSES = [
  "Introduced", "Passed One Chamber", "Passed Both Chambers",
  "Signed Into Law", "Vetoed", "Failed",
] as const;
