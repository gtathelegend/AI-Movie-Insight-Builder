import type { AnalyzeResponse, SSEEvent } from "@/types/ai";
import type { ReviewSource } from "@/types/movie";

export async function streamAnalysis(
  payload: {
    imdbID: string;
    reviews: string[];
    movieTitle?: string;
    movieYear?: string;
    rottenTomatoes?: string;
    sources?: ReviewSource[];
    collectedCount?: number;
  },
  onStep: (msg: string) => void
): Promise<AnalyzeResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const err = (await response.json().catch(() => ({ error: "AI analysis is temporarily unavailable." }))) as {
      error?: string;
      message?: string;
    };
    throw new Error(err.message || err.error || "AI analysis is temporarily unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const messages = buffer.split("\n\n");
    buffer = messages.pop() ?? "";

    for (const message of messages) {
      const trimmedMessage = message.trim();
      if (!trimmedMessage.startsWith("data: ")) continue;

      try {
        const event = JSON.parse(trimmedMessage.slice(6)) as SSEEvent;

        if (event.step === "error") {
          throw new Error(event.message || "AI analysis encountered an error.");
        }

        if (event.step === "complete") {
          return event.data;
        }

        if (event.message) {
          onStep(event.message);
        }
      } catch (parseErr) {
        if (parseErr instanceof Error && parseErr.message !== "Unexpected end of JSON input") {
          throw parseErr;
        }
      }
    }
  }

  throw new Error("Stream closed before analysis completed.");
}
