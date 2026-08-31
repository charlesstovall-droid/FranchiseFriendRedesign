import { useEffect, useState } from "react";
import { useParams } from "wouter";
import type { OwnershipThesis } from "@shared/advisor";
import { CALL_HANDOFF, DEFAULT_CALENDLY_URL, THESIS_CONCLUSION } from "@shared/advisor";
import { AdvisorShell } from "@/components/advisor/AdvisorShell";
import { ThesisView } from "@/components/advisor/ThesisView";
import { advisorJson } from "@/lib/advisor-api";

type ReportPayload = {
  thesis: OwnershipThesis;
  conclusion: string;
  handoff: string;
  bookingCta: string;
  calendlyUrl: string;
  firstName: string | null;
  hasContact: boolean;
  bookingStatus: string;
  resumeToken: string;
};

export default function AdvisorReport() {
  const params = useParams<{ token: string }>();
  const token = params.token || "";
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [error, setError] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [bookingNote, setBookingNote] = useState("");

  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]') || document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "noindex, nofollow");
    document.head.appendChild(robots);
  }, []);

  useEffect(() => {
    if (!token) return;
    advisorJson<ReportPayload>(`/api/advisor/reports/${token}`)
      .then((data) => {
        setReport(data);
        setFirstName(data.firstName || "");
        setShareUrl(`${window.location.origin}/advisor/report/${token}`);
        setContactOpen(!data.hasContact);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "This report is not available."));
  }, [token]);

  const saveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await advisorJson<{ reportUrl: string }>(`/api/advisor/reports/${token}/contact`, {
        method: "POST",
        body: JSON.stringify({ email, phone, firstName, lastName }),
      });
      setShareUrl(result.reportUrl || shareUrl);
      setContactOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save contact details.");
    } finally {
      setSaving(false);
    }
  };

  const setBooking = async (status: "booked" | "declined" | "not_decided", clicked = false) => {
    const result = await advisorJson<{ calendlyUrl: string }>(`/api/advisor/reports/${token}/booking`, {
      method: "POST",
      body: JSON.stringify({ status, clicked }),
    });
    if (status === "booked") setBookingNote("Marked as booked.");
    if (status === "declined") setBookingNote("Understood. The thesis remains yours to keep.");
    return result.calendlyUrl;
  };

  const calendly = report?.calendlyUrl || DEFAULT_CALENDLY_URL;

  return (
    <AdvisorShell
      right={
        report ? (
          <a
            href={`/api/advisor/reports/${token}/pdf`}
            className="text-[11px] uppercase tracking-[0.16em] border border-[#12304C]/30 px-3 py-2 hover:bg-white/40"
          >
            Download PDF
          </a>
        ) : null
      }
    >
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-14">
        {error && !report ? <p className="text-[#8a2b2b]">{error}</p> : null}
        {report ? (
          <>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#12304C]/55 mb-4">Ownership Thesis</p>
            <h1 className="advisor-display text-4xl md:text-5xl leading-tight mb-10">
              {report.firstName ? `${report.firstName}, here is the picture so far.` : "Here is the picture so far."}
            </h1>
            <ThesisView thesis={{ ...report.thesis, conclusion: report.thesis.conclusion || THESIS_CONCLUSION }} />

            <section className="mt-16 border-t border-[var(--advisor-line)] pt-10 print:hidden">
              <p className="advisor-display text-2xl leading-8 mb-6">{report.handoff || CALL_HANDOFF}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setBooking("not_decided", true);
                  }}
                  className="inline-flex items-center justify-center bg-[#F2C740] text-[#12304C] px-6 py-3 text-sm font-semibold"
                >
                  {report.bookingCta}
                </a>
                <button
                  type="button"
                  onClick={() => setBooking("booked")}
                  className="border border-[#12304C] px-6 py-3 text-sm"
                >
                  I booked a time
                </button>
                <button
                  type="button"
                  onClick={() => setBooking("declined")}
                  className="text-sm text-[#12304C]/70 px-2"
                >
                  Not now
                </button>
              </div>
              {bookingNote ? <p className="mt-4 text-sm">{bookingNote}</p> : null}
              {shareUrl ? (
                <p className="mt-6 text-sm text-[#12304C]/70">
                  Private link: <span className="break-all">{shareUrl}</span>
                </p>
              ) : null}
            </section>

            {contactOpen ? (
              <section className="mt-12 border border-[var(--advisor-line)] p-6 print:hidden">
                <h2 className="advisor-display text-2xl mb-3">Save or discuss this thesis</h2>
                <p className="text-sm leading-7 text-[#12304C]/75 mb-6">
                  Email and phone are requested here so you can keep the private link and, if you choose, review it with Chuck.
                </p>
                <form className="grid sm:grid-cols-2 gap-4" onSubmit={saveContact}>
                  <input className="bg-transparent border-b border-[#12304C]/25 py-2" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <input className="bg-transparent border-b border-[#12304C]/25 py-2" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  <input className="bg-transparent border-b border-[#12304C]/25 py-2" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input className="bg-transparent border-b border-[#12304C]/25 py-2" type="tel" required placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={saving} className="bg-[#12304C] text-[#F4ECE1] px-6 py-2.5 text-sm">
                      {saving ? "Saving" : "Save my thesis"}
                    </button>
                  </div>
                </form>
                {error ? <p className="mt-3 text-sm text-[#8a2b2b]">{error}</p> : null}
              </section>
            ) : null}
          </>
        ) : !error ? (
          <p className="text-[#12304C]/60">Preparing the thesis.</p>
        ) : null}
      </div>
    </AdvisorShell>
  );
}
