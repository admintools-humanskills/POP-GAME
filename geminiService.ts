import { AnalysisResult, GameInputs } from "./types";

const PROXY_URL = import.meta.env.VITE_GEMINI_PROXY_URL;

export async function analyzeGameNeeds(
  inputs: GameInputs
): Promise<AnalysisResult | null> {
  if (!PROXY_URL) {
    console.error("VITE_GEMINI_PROXY_URL is not configured");
    return null;
  }

  try {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: inputs.mode,
        description: inputs.description,
        ageRange: inputs.ageRange || "Non spécifié (tous âges)",
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    return (await response.json()) as AnalysisResult;
  } catch (error) {
    console.error("Asmodee AI Engine Error:", error);
    return null;
  }
}
