/** Server-only client for the live Tanova Vendor API. Never import this from a
 *  "use client" file — TANOVA_API_KEY has no NEXT_PUBLIC_ prefix specifically so
 *  Next.js refuses to inline it into any client bundle; this file just enforces
 *  the same rule at the call site.
 *
 *  Every catalogue read goes through here with Next's own fetch cache — `revalidate`
 *  controls how stale a page is allowed to get before the next request triggers a
 *  background refetch (stale-while-revalidate, not a hard block on the response).
 *  Call `revalidateTag()` from a webhook/route handler for instant updates instead
 *  of waiting out the window, once that's wired up. */

const DEFAULT_REVALIDATE_SECONDS = 300; // 5 minutes — catalogue content, not a live seat counter

export class TanovaApiError extends Error {
  constructor(public status: number, public path: string, message: string) {
    super(message);
  }
}

type FetchOpts = { revalidate?: number | false; tags?: string[] };

export async function tanovaGet<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const base = process.env.TANOVA_API_BASE;
  const key = process.env.TANOVA_API_KEY;
  if (!base || !key) {
    throw new Error("TANOVA_API_BASE / TANOVA_API_KEY are not configured.");
  }

  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    next: { revalidate: opts.revalidate ?? DEFAULT_REVALIDATE_SECONDS, tags: opts.tags },
  });

  if (!res.ok) {
    throw new TanovaApiError(res.status, path, `Tanova API ${path} returned ${res.status}`);
  }

  return res.json();
}

/** Standard Laravel paginator shape every Tanova list endpoint returns, unwrapped. */
export type Paginated<T> = { current_page: number; data: T[]; total: number; per_page: number; last_page: number };

/** Fetches every page of a paginated endpoint (the catalogue is small — tens of
 *  items, not thousands — so one or two requests, not a real pagination UI). */
export async function tanovaGetAll<T>(path: string, opts: FetchOpts = {}): Promise<T[]> {
  const sep = path.includes("?") ? "&" : "?";
  const first = await tanovaGet<{ data: Paginated<T> }>(`${path}${sep}per_page=100`, opts);
  const items = [...first.data.data];
  for (let page = 2; page <= first.data.last_page; page++) {
    const next = await tanovaGet<{ data: Paginated<T> }>(`${path}${sep}per_page=100&page=${page}`, opts);
    items.push(...next.data.data);
  }
  return items;
}
