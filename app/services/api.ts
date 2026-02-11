// Use EXPO_PUBLIC_API_URL env var in production, fall back to localhost for dev.
const BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiSource {
  title: string;
  url: string;
}

export interface ApiLenses {
  physics: string;
  math: string;
  human: string;
  contemplative: string;
}

export interface ApiConfidence {
  confident: string[];
  uncertain: string[];
}

export interface ChatApiResponse {
  response_id: string;
  main_text: string;
  lenses: ApiLenses;
  confidence: ApiConfidence;
  sources: ApiSource[];
}

export async function sendMessage(
  userText: string,
  previousResponseId?: string | null
): Promise<ChatApiResponse> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_text: userText,
      previous_response_id: previousResponseId ?? null,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "Unknown error");
    throw new Error(`Server error ${res.status}: ${errBody}`);
  }

  return res.json();
}
