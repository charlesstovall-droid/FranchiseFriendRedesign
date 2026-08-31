import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { AdvisorShell } from "@/components/advisor/AdvisorShell";
import { advisorJson } from "@/lib/advisor-api";

const links = [
  { href: "/admin/advisor", label: "Candidates" },
  { href: "/admin/advisor/brands", label: "Approved brands" },
  { href: "/admin/advisor/settings", label: "Copy and prompts" },
  { href: "/admin/advisor/analytics", label: "Analytics" },
];

export function AdvisorAdminFrame({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]') || document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "noindex, nofollow");
    document.head.appendChild(robots);
    advisorJson("/api/advisor/admin/me")
      .then(() => setReady(true))
      .catch(() => setLocation("/admin/advisor/login"));
  }, [setLocation]);

  if (!ready) {
    return (
      <AdvisorShell eyebrow="Franchise Friend · Internal">
        <div className="max-w-5xl mx-auto px-5 py-20 text-[#12304C]/60">Checking access.</div>
      </AdvisorShell>
    );
  }

  return (
    <AdvisorShell
      eyebrow="Franchise Friend · Internal · Candidates never see this"
      right={
        <button
          type="button"
          className="text-[11px] uppercase tracking-[0.16em]"
          onClick={async () => {
            await advisorJson("/api/advisor/admin/logout", { method: "POST" }).catch(() => undefined);
            setLocation("/admin/advisor/login");
          }}
        >
          Sign out
        </button>
      }
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        <nav className="flex flex-wrap gap-5 text-[12px] uppercase tracking-[0.16em] border-b border-[var(--advisor-line)] pb-4 mb-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#12304C]/70">
              {link.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </AdvisorShell>
  );
}
