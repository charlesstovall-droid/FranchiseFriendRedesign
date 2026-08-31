import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import type { AdvisorChapter } from "@shared/advisor";
import { DEFAULT_ADVISOR_COPY } from "@shared/advisor-copy";
import { AdvisorShell } from "@/components/advisor/AdvisorShell";
import { ChapterMarker } from "@/components/advisor/ChapterMarker";
import { ThinkingState } from "@/components/advisor/ThinkingState";
import { advisorJson } from "@/lib/advisor-api";

type Message = { id?: string; role: string; content: string; chapter?: string | null };

export default function AdvisorConversation() {
  const [, setLocation] = useLocation();
  const [copy, setCopy] = useState(DEFAULT_ADVISOR_COPY);
  const [configured, setConfigured] = useState(true);
  const [resumeToken, setResumeToken] = useState("");
  const [chapter, setChapter] = useState<AdvisorChapter>("why_now");
  const [messages, setMessages] = useState<Message[]>([]);
  const [consent, setConsent] = useState(false);
  const [input, setInput] = useState("");
  const [suggested, setSuggested] = useState<string[]>([]);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState<string | null>(null);
  const [readyForThesis, setReadyForThesis] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const status = await advisorJson<{ configured: boolean; copy: typeof DEFAULT_ADVISOR_COPY }>("/api/advisor/status");
        if (!cancelled && status.copy) setCopy(status.copy);
        if (!cancelled) setConfigured(status.configured);
        const current = await advisorJson<{
          configured: boolean;
          candidate: { firstName: string | null; resumeToken: string; reportToken: string | null };
          chapter: AdvisorChapter;
          messages: Message[];
          hasThesis: boolean;
          reportToken: string | null;
        }>("/api/advisor/conversations/current");
        if (cancelled) return;
        setResumeToken(current.candidate.resumeToken);
        setChapter(current.chapter);
        setMessages(current.messages);
        setFirstName(current.candidate.firstName);
        setConfigured(current.configured);
        if (current.hasThesis && current.reportToken) {
          setLocation(`/advisor/report/${current.reportToken}`);
        }
      } catch {
        try {
          const started = await advisorJson<{
            configured: boolean;
            resumeToken: string;
            chapter: AdvisorChapter;
            openingMessage: string;
            copy: typeof DEFAULT_ADVISOR_COPY;
          }>("/api/advisor/conversations", { method: "POST" });
          if (cancelled) return;
          setResumeToken(started.resumeToken);
          setChapter(started.chapter);
          setConfigured(started.configured);
          if (started.copy) setCopy(started.copy);
          setMessages([{ role: "assistant", content: started.openingMessage }]);
        } catch (err) {
          if (!cancelled) setError(err instanceof Error ? err.message : "Could not open the conversation.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setLocation]);

  const latestAssistant = useMemo(
    () => [...messages].reverse().find((m) => m.role === "assistant")?.content || copy.openingMessage,
    [messages, copy.openingMessage],
  );

  const send = async (text: string, inputType = "written") => {
    const value = text.trim();
    if (!value || !resumeToken || thinking) return;
    setThinking(true);
    setError("");
    setInput("");
    setSuggested([]);
    setMessages((prev) => [...prev, { role: "user", content: value }]);
    try {
      const result = await advisorJson<{
        configured: boolean;
        message: string;
        chapter: AdvisorChapter;
        suggestedAnswers: string[];
        readyForThesis: boolean;
        firstName?: string | null;
      }>(`/api/advisor/conversations/${resumeToken}/turns`, {
        method: "POST",
        body: JSON.stringify({ message: value, inputType }),
      });
      setConfigured(result.configured);
      setChapter(result.chapter);
      setSuggested(result.suggestedAnswers || []);
      setReadyForThesis(result.readyForThesis);
      setFirstName(result.firstName || firstName);
      setMessages((prev) => [...prev, { role: "assistant", content: result.message, chapter: result.chapter }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That turn could not be completed.");
    } finally {
      setThinking(false);
    }
  };

  const generateThesis = async () => {
    if (!resumeToken) return;
    setThinking(true);
    try {
      const result = await advisorJson<{ reportToken: string }>(`/api/advisor/conversations/${resumeToken}/thesis`, {
        method: "POST",
      });
      setLocation(`/advisor/report/${result.reportToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The thesis could not be written yet.");
      setThinking(false);
    }
  };

  const acceptConsent = async () => {
    setConsent(true);
    if (resumeToken) {
      await advisorJson(`/api/advisor/conversations/${resumeToken}/consent`, { method: "POST" }).catch(() => undefined);
    }
  };

  return (
    <AdvisorShell right={<ChapterMarker chapter={chapter} />}>
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16 min-h-[70vh]">
        {loading ? (
          <ThinkingState />
        ) : !consent ? (
          <div className="advisor-enter max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#12304C]/55 mb-4">Before we begin</p>
            <h1 className="advisor-display text-3xl md:text-4xl leading-tight mb-6">A private conversation, not a sales quiz.</h1>
            <p className="leading-8 text-lg mb-5">{copy.privacyConsent}</p>
            <p className="leading-8 text-[#12304C]/80 mb-8">{copy.aiDisclosure}</p>
            <button
              type="button"
              onClick={acceptConsent}
              className="bg-[#F2C740] text-[#12304C] px-7 py-3 text-sm font-semibold"
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            {!configured ? (
              <p className="mb-8 text-sm border border-[#12304C]/20 px-4 py-3">{copy.unconfiguredMessage}</p>
            ) : null}
            {thinking ? (
              <ThinkingState name={firstName} />
            ) : (
              <div className="advisor-enter">
                <p className="advisor-display text-2xl md:text-[2rem] leading-snug">{latestAssistant}</p>
                {suggested.length ? (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {suggested.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => send(item, "suggested")}
                        className="border border-[#12304C]/25 px-3.5 py-2 text-sm hover:border-[#12304C] hover:bg-white/40"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            <form
              className="mt-12"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <label htmlFor="advisor-answer" className="sr-only">
                Your answer
              </label>
              <textarea
                id="advisor-answer"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={thinking || !configured}
                rows={4}
                className="w-full bg-transparent border-b border-[#12304C]/25 focus:border-[#12304C] outline-none py-3 text-lg leading-8 resize-none"
                placeholder="Write in your own words."
              />
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  type="submit"
                  disabled={thinking || !input.trim() || !configured}
                  className="bg-[#12304C] text-[#F4ECE1] px-7 py-3 text-sm font-semibold disabled:opacity-40"
                >
                  Continue
                </button>
                {readyForThesis ? (
                  <button
                    type="button"
                    onClick={generateThesis}
                    disabled={thinking}
                    className="border border-[#12304C] px-7 py-3 text-sm font-semibold"
                  >
                    Write my Ownership Thesis
                  </button>
                ) : null}
              </div>
            </form>
            {error ? <p className="mt-5 text-sm text-[#8a2b2b]">{error}</p> : null}
            {resumeToken ? (
              <p className="mt-10 text-xs text-[#12304C]/55">
                You can return later: <span className="break-all">/advisor/resume/{resumeToken}</span>
              </p>
            ) : null}
          </>
        )}
      </div>
    </AdvisorShell>
  );
}
