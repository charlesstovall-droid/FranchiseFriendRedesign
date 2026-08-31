import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdvisorShell } from "@/components/advisor/AdvisorShell";
import { advisorJson } from "@/lib/advisor-api";

export default function AdvisorAdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    advisorJson("/api/advisor/admin/me")
      .then(() => setLocation("/admin/advisor"))
      .catch(() => setChecking(false));
  }, [setLocation]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await advisorJson("/api/advisor/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setLocation("/admin/advisor");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  };

  if (checking) {
    return (
      <AdvisorShell eyebrow="Franchise Friend · Internal">
        <div className="max-w-md mx-auto px-5 py-24 text-[#12304C]/60">Checking access.</div>
      </AdvisorShell>
    );
  }

  return (
    <AdvisorShell eyebrow="Franchise Friend · Internal">
      <div className="max-w-md mx-auto px-5 py-20">
        <h1 className="advisor-display text-4xl mb-3">Advisor desk</h1>
        <p className="text-sm text-[#12304C]/70 mb-8">
          For Chuck and authorized staff only. Candidates never see this page.
        </p>
        <form onSubmit={submit} className="space-y-5">
          <input className="w-full bg-transparent border-b border-[#12304C]/25 py-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full bg-transparent border-b border-[#12304C]/25 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="bg-[#12304C] text-[#F4ECE1] px-6 py-2.5 text-sm">Enter</button>
          {error ? <p className="text-sm text-[#8a2b2b]">{error}</p> : null}
        </form>
        <p className="mt-8 text-xs text-[#12304C]/55">
          Existing Franchise Friend admin sessions are also accepted. Google or member-admin login still works.
        </p>
      </div>
    </AdvisorShell>
  );
}
