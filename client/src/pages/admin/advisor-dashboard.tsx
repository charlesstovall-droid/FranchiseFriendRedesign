import { useEffect, useState } from "react";
import { Link } from "wouter";
import { AdvisorAdminFrame } from "./advisor-layout";
import { advisorJson } from "@/lib/advisor-api";

type Row = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  status: string;
  bookingStatus: string;
  liquidCapitalRange: string | null;
  timeline: string | null;
  preferredOwnerRole: string | null;
  primaryConflict: string | null;
  lastActiveAt: string;
  hasReport: boolean;
};

export default function AdvisorAdminDashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [booking, setBooking] = useState("");
  const [capital, setCapital] = useState("");
  const [timeline, setTimeline] = useState("");
  const [role, setRole] = useState("");
  const [conflict, setConflict] = useState("");

  const load = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (booking) params.set("booking", booking);
    if (capital) params.set("capital", capital);
    if (timeline) params.set("timeline", timeline);
    if (role) params.set("role", role);
    if (conflict) params.set("conflict", conflict);
    advisorJson<{ candidates: Row[] }>(`/api/advisor/admin/candidates?${params.toString()}`)
      .then((data) => setRows(data.candidates))
      .catch(() => setRows([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdvisorAdminFrame>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="advisor-display text-4xl">Candidates</h1>
          <p className="text-sm text-[#12304C]/65 mt-2">Search and filter without a busy dashboard.</p>
        </div>
        <button type="button" onClick={load} className="text-sm border border-[#12304C]/30 px-3 py-2">
          Refresh
        </button>
      </div>
      <div className="grid md:grid-cols-4 gap-3 mb-8">
        <input className="bg-transparent border-b border-[#12304C]/25 py-2" placeholder="Search name, email, city" value={q} onChange={(e) => setQ(e.target.value)} />
        <input className="bg-transparent border-b border-[#12304C]/25 py-2" placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
        <input className="bg-transparent border-b border-[#12304C]/25 py-2" placeholder="Booking" value={booking} onChange={(e) => setBooking(e.target.value)} />
        <input className="bg-transparent border-b border-[#12304C]/25 py-2" placeholder="Capital range" value={capital} onChange={(e) => setCapital(e.target.value)} />
        <input className="bg-transparent border-b border-[#12304C]/25 py-2" placeholder="Timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
        <input className="bg-transparent border-b border-[#12304C]/25 py-2" placeholder="Desired role" value={role} onChange={(e) => setRole(e.target.value)} />
        <input className="bg-transparent border-b border-[#12304C]/25 py-2" placeholder="Primary conflict" value={conflict} onChange={(e) => setConflict(e.target.value)} />
        <button type="button" onClick={load} className="bg-[#12304C] text-[#F4ECE1] text-sm">
          Apply
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.14em] border-b border-[var(--advisor-line)]">
              <th className="py-3 font-medium">Candidate</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium">Booking</th>
              <th className="py-3 font-medium">Capital</th>
              <th className="py-3 font-medium">Role</th>
              <th className="py-3 font-medium">Conflict</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--advisor-line)]">
                <td className="py-3">
                  <Link href={`/admin/advisor/candidates/${row.id}`} className="hover:underline">
                    {[row.firstName, row.lastName].filter(Boolean).join(" ") || row.email || "Unnamed"}
                  </Link>
                  <div className="text-xs text-[#12304C]/55">{row.email}</div>
                </td>
                <td className="py-3">{row.status}{row.hasReport ? " · thesis" : ""}</td>
                <td className="py-3">{row.bookingStatus}</td>
                <td className="py-3">{row.liquidCapitalRange || "—"}</td>
                <td className="py-3">{row.preferredOwnerRole || "—"}</td>
                <td className="py-3 max-w-xs">{row.primaryConflict || "—"}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td className="py-8 text-[#12304C]/55" colSpan={6}>No candidates yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AdvisorAdminFrame>
  );
}
