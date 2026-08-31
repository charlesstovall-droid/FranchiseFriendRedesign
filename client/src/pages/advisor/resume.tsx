import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { AdvisorShell } from "@/components/advisor/AdvisorShell";
import { advisorJson } from "@/lib/advisor-api";

export default function AdvisorResume() {
  const params = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = params.token;
    if (!token) return;
    advisorJson<{ reportToken?: string | null; status?: string }>(`/api/advisor/resume/${token}`)
      .then((data) => {
        if (data.reportToken && data.status === "completed") {
          setLocation(`/advisor/report/${data.reportToken}`);
        } else {
          setLocation("/advisor/conversation");
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "This resume link is not valid."));
  }, [params.token, setLocation]);

  return (
    <AdvisorShell>
      <div className="max-w-xl mx-auto px-5 py-24">
        <h1 className="advisor-display text-3xl mb-4">Returning to your conversation</h1>
        <p className="text-[#12304C]/75">{error || "One moment."}</p>
      </div>
    </AdvisorShell>
  );
}
