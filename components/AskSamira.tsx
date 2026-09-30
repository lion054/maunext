"use client";

import { useEffect, useRef, useState } from "react";
import s from "./AskSamira.module.css";

/** Real AI chat, proxied through /api/chat so no API key ever reaches the browser.
 *  Built to never go down: the route tries Claude, then Groq, then a rule-based
 *  offline reply that needs no network call at all — so this widget always has
 *  something real and useful to say, even with zero AI keys configured.
 *  When the reply needs a human, it hands off through the existing /api/concierge
 *  route, which creates a real conversation in Mauly's own Tanova inbox — not a
 *  separate, fake ticket system. */

type PageLink = { label: string; url: string; type?: string };
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  pageLinks?: PageLink[];
  suggestedFollowUps?: string[];
  needsTicket?: boolean;
  ticketSubject?: string | null;
};

const QUICK_CHIPS = [
  "Plan a safari for me",
  "Kilimanjaro trek options?",
  "Halal safari options?",
  "How much does a safari cost?",
];

// Strips everything except the handful of tags Samira's prompt permits —
// protects against a jailbroken or hallucinated reply injecting markup.
function sanitizeHtml(html: string) {
  if (!html) return "";
  return html
    .replace(/<(?!\/?(?:strong|b|br)\b)[^>]+>/gi, "")
    .replace(/\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    .replace(/javascript\s*:/gi, "");
}

function TicketHandoff({ subject, chatHistory }: { subject: string | null | undefined; chatHistory: ChatMessage[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || sending) return;
    setSending(true);
    setError(false);
    const transcript = chatHistory.map((m) => `${m.role === "user" ? "Guest" : "Samira"}: ${m.content.replace(/<[^>]+>/g, " ")}`).join("\n");
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          message: `${subject || "Chat handoff"}\n\n${transcript}`,
          guestName: name.trim(),
          guestEmail: email.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className={s.ticketBox}>
        <div className={s.ticketSent}>&#10003; Sent to our team &mdash; expect a reply within 24 hours.</div>
      </div>
    );
  }

  return (
    <form className={s.ticketBox} onSubmit={submit}>
      <p>Get this in front of our team &mdash; leave your name and email and they&rsquo;ll follow up directly.</p>
      <div className={s.ticketRow}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={sending} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={sending} />
      </div>
      {error && <p style={{ color: "var(--off-fg)" }}>Something went wrong &mdash; please try again.</p>}
      <button type="submit" className={s.sendBtn} disabled={sending || !name.trim() || !email.trim()}>
        {sending ? "Sending…" : "Notify the team"}
      </button>
    </form>
  );
}

export default function AskSamira() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((cur) => [...cur, { role: "assistant", content: data.error || "Something went wrong — please try again." }]);
        return;
      }
      setMessages((cur) => [...cur, {
        role: "assistant",
        content: data.content || "",
        pageLinks: data.pageLinks || [],
        suggestedFollowUps: data.suggestedFollowUps || [],
        needsTicket: data.needsTicket || false,
        ticketSubject: data.ticketSubject || null,
      }]);
    } catch {
      setMessages((cur) => [...cur, { role: "assistant", content: "Could not reach Samira right now — please try again in a moment." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button data-samira-fab className={s.bubble} type="button" aria-label="Ask Samira, our concierge" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <svg className={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span>{open ? "Close" : "Ask Samira"}</span>
      </button>

      {open && (
        <div className={s.panel} ref={panelRef} role="dialog" aria-label="Ask Samira">
          <div className={s.panelHead}>
            <div>
              <b>Samira, Mauly Concierge</b>
              <span>AI-powered &middot; answers instantly</span>
            </div>
            <button type="button" className={s.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l14 14M19 5L5 19" /></svg>
            </button>
          </div>

          <div className={s.thread} ref={threadRef}>
            {messages.length === 0 && (
              <div className={`${s.msgRow} ${s.msgRowBot}`}>
                <div className={`${s.msgBubble} ${s.msgBubbleBot}`}>
                  Jambo! I&rsquo;m Samira &mdash; ask me about routes, dates, pricing, halal safaris, anything.
                </div>
                <div className={s.chipsRow}>
                  {QUICK_CHIPS.map((c) => (
                    <button key={c} type="button" className={s.chip} onClick={() => send(c)}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`${s.msgRow} ${m.role === "user" ? s.msgRowUser : s.msgRowBot}`}>
                <div
                  className={`${s.msgBubble} ${m.role === "user" ? s.msgBubbleUser : s.msgBubbleBot}`}
                  dangerouslySetInnerHTML={{ __html: m.role === "assistant" ? sanitizeHtml(m.content) : m.content.replace(/</g, "&lt;") }}
                />
                {m.role === "assistant" && m.pageLinks && m.pageLinks.length > 0 && (
                  <div className={s.linkRow}>
                    {m.pageLinks.map((l) => (
                      <a key={l.url + l.label} href={l.url} className={s.linkBtn}>
                        <span>{l.label}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </a>
                    ))}
                  </div>
                )}
                {m.role === "assistant" && i === messages.length - 1 && m.needsTicket && (
                  <TicketHandoff subject={m.ticketSubject} chatHistory={messages} />
                )}
                {m.role === "assistant" && i === messages.length - 1 && !m.needsTicket && m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                  <div className={s.chipsRow}>
                    {m.suggestedFollowUps.map((c) => (
                      <button key={c} type="button" className={s.chip} onClick={() => send(c)}>{c}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className={`${s.msgRow} ${s.msgRowBot}`}>
                <div className={`${s.msgBubble} ${s.msgBubbleBot}`}>
                  <span className={s.typing}><i /><i /><i /></span>
                </div>
              </div>
            )}
          </div>

          <form
            className={s.composer}
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <textarea
              ref={inputRef}
              className={s.composerInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask Samira anything…"
              rows={1}
              disabled={sending}
            />
            <button type="submit" className={s.composerSend} disabled={sending || !input.trim()} aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
