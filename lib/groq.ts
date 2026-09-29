/** Groq chat completions — the LLM fallback used when Claude is unavailable, so
 *  Samira never goes fully silent just because one provider has an outage.
 *  Groq retires hosted models without notice, so callers get a list of models and
 *  we walk it, skipping any the account can no longer serve — one retirement
 *  shouldn't silently drop Samira straight to the offline rule-based reply. */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const GROQ_CHAT_MODELS = [
  "qwen/qwen3.8-27b",
  "groq/compound-mini",
  "openai/gpt-oss-120b",
];

function isModelGone(status: number, body: string) {
  if (status !== 404 && status !== 400) return false;
  return /model_not_found|does not exist|decommissioned|deprecated/i.test(body || "");
}

export type GroqMessage = { role: "system" | "user" | "assistant"; content: string };

export async function groqChat({
  messages,
  maxTokens = 600,
  temperature,
  json = false,
  timeoutMs = 12_000,
  models = GROQ_CHAT_MODELS,
}: {
  messages: GroqMessage[];
  maxTokens?: number;
  temperature?: number;
  json?: boolean;
  timeoutMs?: number;
  models?: string[];
}): Promise<{ content: string; model: string }> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY not set");

  let lastErr: Error | undefined;

  for (const model of models) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const body: Record<string, unknown> = { model, messages, max_tokens: maxTokens };
      if (temperature !== undefined) body.temperature = temperature;
      if (json) body.response_format = { type: "json_object" };

      const res = await fetch(GROQ_URL, {
        method: "POST",
        signal: ac.signal,
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        if (isModelGone(res.status, text)) {
          lastErr = new Error(`Groq model ${model} unavailable`);
          continue;
        }
        throw new Error(`Groq HTTP ${res.status}: ${text.slice(0, 200)}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        lastErr = new Error(`Empty Groq response from ${model}`);
        continue;
      }
      return { content, model };
    } catch (err) {
      lastErr = err as Error;
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastErr || new Error("No Groq model available");
}
