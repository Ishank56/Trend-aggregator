import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// AI Summarization using Cohere API
export async function summarizeText(text: string): Promise<string> {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) {
    console.warn("Cohere API key not configured");
    return "AI summarization is not available.";
  }
  try {
    const response = await fetch("https://api.cohere.ai/v1/summarize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        length: "medium",
        format: "bullets",
        model: "command",
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("Cohere summarization error:", error);
      return "Failed to generate summary.";
    }
    const data = await response.json();
    return data.summary || "No summary generated.";
  } catch (error) {
    console.error("Cohere summarization error:", error);
    return "Failed to generate summary.";
  }
}