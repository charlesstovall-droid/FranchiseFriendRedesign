import { useEffect, useState } from "react";
import { AdvisorAdminFrame } from "./advisor-layout";
import { advisorJson } from "@/lib/advisor-api";

export default function AdvisorAdminAnalytics() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    advisorJson("/api/advisor/admin/analytics").then(setData).catch(() => undefined);
  }, []);

  const items = data
    ? [
        ["Starts", data.starts],
        ["Thesis completions", data.thesisCompletions],
        ["Contact submissions", data.contactSubmissions],
        ["Report downloads", data.reportDownloads],
        ["Booking link clicks", data.bookingLinkClicks],
        ["Confirmed bookings", data.confirmedBookings],
        ["Returning candidates", data.returningCandidates],
        ["Average completion (minutes)", data.averageCompletionMinutes],
        ["Total candidates", data.totalCandidates],
      ]
    : [];

  return (
    <AdvisorAdminFrame>
      <h1 className="advisor-display text-4xl mb-8">Analytics</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map(([label, value]) => (
          <div key={String(label)} className="border border-[var(--advisor-line)] p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#12304C]/55">{label}</p>
            <p className="advisor-display text-3xl mt-2">{value ?? 0}</p>
          </div>
        ))}
      </div>
      {data?.chapterDrop ? (
        <div className="mt-10">
          <h2 className="advisor-display text-2xl mb-4">Drop-off chapter</h2>
          {Object.entries(data.chapterDrop as Record<string, number>).map(([chapter, count]) => (
            <p key={chapter} className="text-sm py-1">{chapter}: {count}</p>
          ))}
        </div>
      ) : null}
    </AdvisorAdminFrame>
  );
}
