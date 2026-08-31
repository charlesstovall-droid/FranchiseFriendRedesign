import { useState } from "react";
import { AdvisorShell } from "@/components/advisor/AdvisorShell";
import { advisorJson } from "@/lib/advisor-api";

export default function AdvisorPrivacy() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await advisorJson("/api/advisor/deletion-requests", {
        method: "POST",
        body: JSON.stringify({ email, token, message }),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the request.");
    }
  };

  return (
    <AdvisorShell>
      <div className="max-w-xl mx-auto px-5 py-16">
        <h1 className="advisor-display text-4xl mb-6">Ownership Advisor privacy</h1>
        <p className="leading-8 mb-8">
          Candidate conversations, transcripts, and Ownership Theses live in this application. They are not sold for unrelated marketing. You can request deletion at any time.
        </p>
        {done ? (
          <p>Your request was received. Chuck or an administrator will complete it.</p>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <input className="w-full bg-transparent border-b border-[#12304C]/25 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full bg-transparent border-b border-[#12304C]/25 py-2" placeholder="Resume or report token, if you have one" value={token} onChange={(e) => setToken(e.target.value)} />
            <textarea className="w-full bg-transparent border-b border-[#12304C]/25 py-2" rows={4} placeholder="Anything we should know" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button type="submit" className="bg-[#12304C] text-[#F4ECE1] px-6 py-2.5 text-sm">Request deletion</button>
            {error ? <p className="text-sm text-[#8a2b2b]">{error}</p> : null}
          </form>
        )}
      </div>
    </AdvisorShell>
  );
}
