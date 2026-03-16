import type { Category } from "../types";

export interface AnalysisResult {
  category_ids: number[];
  social_media_definition: string | null;
  notes: string | null;
  enforcement_status: string | null;
}

export async function analyzeBillText(
  apiKey: string,
  billText: string,
  categories: Category[],
  billTitle: string,
  state: string
): Promise<AnalysisResult> {
  const categoryList = categories.map((c) => `- ID ${c.id}: ${c.name}`).join("\n");

  const prompt = `You are analyzing a US state legislative bill to help track social media regulation.

Bill title: ${billTitle}
State: ${state}

Here are the available categories. Return ONLY the IDs of categories that apply to this bill:
${categoryList}

Analyze the bill text below and return a JSON object with these fields:
- "category_ids": array of category ID numbers that apply to this bill
- "social_media_definition": the exact definition of "social media" or "social media platform" or equivalent term as written in the bill text, or null if not defined. Quote the bill text directly.
- "notes": a brief 2-3 sentence editorial summary for a general audience explaining what this bill would require of social media platforms and who it affects. Write in plain language, not legalese. Note how broadly or narrowly "social media" is defined and whether smaller or independent platforms would likely be covered.
- "enforcement_status": null (this is set manually later)

Return ONLY valid JSON, no other text.

BILL TEXT:
${billText}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = await response.json() as {
    content: Array<{ type: string; text?: string }>;
  };

  const textBlock = data.content.find((b) => b.type === "text");
  if (!textBlock?.text) {
    throw new Error("No text response from Claude");
  }

  // Extract JSON from response (handle markdown code blocks)
  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1].trim();

  const result = JSON.parse(jsonStr) as AnalysisResult;

  // Validate category IDs against actual categories
  const validIds = new Set(categories.map((c) => c.id));
  result.category_ids = result.category_ids.filter((id) => validIds.has(id));

  return result;
}
