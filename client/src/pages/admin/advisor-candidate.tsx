import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { ThesisView } from "@/components/advisor/ThesisView";
import { AdvisorAdminFrame } from "./advisor-layout";
import { advisorJson } from "@/lib/advisor-api";
import type { MeetingBrief, OwnershipThesis } from "@shared/advisor";

const BRIEF_FIELDS: Array<{ key: keyof MeetingBrief; label: string }> = [
  { key: "candidateInOneParagraph", label: "1 Candidate in One Paragraph" },
  { key: "whatTheySayTheyWant", label: "2 What They Say They Want" },
  { key: "whatTheyMayActuallyBeSolvingFor", label: "3 What They May Actually Be Solving For" },
  { key: "financialReality", label: "4 Financial Reality" },
  { key: "familyOrLifestyleConstraints", label: "5 Family or Lifestyle Constraints" },
  { key: "contradictionsToExplore", label: "6 Contradictions to Explore" },
  { key: "likelyDecisionStyle", label: "7 Likely Decision Style" },
  { key: "suitableBusinessModelCharacteristics", label: "8 Suitable Business-Model Characteristics" },
  { key: "modelsToApproachCarefully", label: "9 Models to Approach Carefully" },
  { key: "suggestedOpeningForTheStrategyCall", label: "11 Suggested Opening for the Strategy Call" },
  { key: "suggestedFollowUpEmail", label: "12 Suggested Follow-Up Email" },
];

export default function AdvisorAdminCandidate() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [brief, setBrief] = useState<MeetingBrief | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    advisorJson<any>(`/api/advisor/admin/candidates/${params.id}`)
      .then((bundle) => {
        setData(bundle);
        setNotes(bundle.brief?.privateNotes || "");
        setBrief((bundle.brief?.editedBrief || bundle.brief?.brief) as MeetingBrief | null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Not found"));
  };

  useEffect(() => {
    if (params.id) load();
  }, [params.id]);

  const saveBrief = async () => {
    if (!brief) return;
    await advisorJson(`/api/advisor/admin/candidates/${params.id}/brief`, {
      method: "PATCH",
      body: JSON.stringify({ editedBrief: brief, privateNotes: notes }),
    });
  };

  const regenerate = async () => {
    const result = await advisorJson<{ brief: { brief: MeetingBrief } }>(`/api/advisor/admin/candidates/${params.id}/brief/regenerate`, {
      method: "POST",
    });
    setBrief(result.brief.brief);
  };

  if (error) {
    return (
      <AdvisorAdminFrame>
        <p>{error}</p>
      </AdvisorAdminFrame>
    );
  }
  if (!data) {
    return (
      <AdvisorAdminFrame>
        <p>Loading candidate.</p>
      </AdvisorAdminFrame>
    );
  }

  const name = [data.candidate.firstName, data.candidate.lastName].filter(Boolean).join(" ") || "Unnamed candidate";

  return (
    <AdvisorAdminFrame>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="advisor-display text-4xl">{name}</h1>
          <p className="text-sm text-[#12304C]/65 mt-2">
            {data.candidate.email || "No email yet"} · {data.candidate.status} · booking {data.candidate.bookingStatus}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {data.reportUrl ? <a className="border border-[#12304C]/30 px-3 py-2" href={data.reportUrl} target="_blank" rel="noreferrer">Open report</a> : null}
          <button type="button" className="border border-[#12304C]/30 px-3 py-2" onClick={async () => { await advisorJson(`/api/advisor/admin/candidates/${params.id}/archive`, { method: "POST" }); load(); }}>
            Archive
          </button>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="advisor-display text-2xl mb-4">Chuck Meeting Brief</h2>
        {brief ? (
          <div className="space-y-5">
            {BRIEF_FIELDS.map((field) => (
              <label key={field.key} className="block">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#12304C]/55">{field.label}</span>
                <textarea
                  className="mt-2 w-full bg-transparent border border-[var(--advisor-line)] p-3 min-h-24"
                  value={String(brief[field.key] || "")}
                  onChange={(e) => setBrief({ ...brief, [field.key]: e.target.value })}
                />
              </label>
            ))}
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#12304C]/55">10 Three Questions Chuck Should Ask Next</span>
              <textarea
                className="mt-2 w-full bg-transparent border border-[var(--advisor-line)] p-3 min-h-24"
                value={(brief.threeQuestionsChuckShouldAskNext || []).join("\n")}
                onChange={(e) => setBrief({ ...brief, threeQuestionsChuckShouldAskNext: e.target.value.split("\n").filter(Boolean) })}
              />
            </label>
            <div className="flex gap-3">
              <button type="button" className="bg-[#12304C] text-[#F4ECE1] px-4 py-2 text-sm" onClick={saveBrief}>Save brief</button>
              <button type="button" className="border border-[#12304C] px-4 py-2 text-sm" onClick={regenerate}>Regenerate</button>
            </div>
          </div>
        ) : (
          <button type="button" className="border border-[#12304C] px-4 py-2 text-sm" onClick={regenerate}>
            Generate meeting brief
          </button>
        )}
      </section>

      <section className="mb-12">
        <h2 className="advisor-display text-2xl mb-3">Private notes</h2>
        <textarea className="w-full bg-transparent border border-[var(--advisor-line)] p-3 min-h-28" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="button" className="mt-3 text-sm border border-[#12304C]/30 px-3 py-2" onClick={saveBrief}>Save notes</button>
      </section>

      {data.report?.thesis ? (
        <section className="mb-12">
          <h2 className="advisor-display text-2xl mb-6">Ownership Thesis</h2>
          <ThesisView thesis={data.report.thesis as OwnershipThesis} />
        </section>
      ) : null}

      <section>
        <h2 className="advisor-display text-2xl mb-4">Transcript</h2>
        <div className="space-y-5">
          {(data.messages || []).map((message: { id: string; role: string; content: string }) => (
            <div key={message.id} className="border-b border-[var(--advisor-line)] pb-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#12304C]/50 mb-1">{message.role}</p>
              <p className="leading-7 whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>
      </section>
    </AdvisorAdminFrame>
  );
}
