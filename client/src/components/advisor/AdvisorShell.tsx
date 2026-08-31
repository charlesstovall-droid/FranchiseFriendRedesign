import type { ReactNode } from "react";
import { AdvisorWordmark } from "./AdvisorMark";

export function AdvisorShell({
  children,
  right,
  footer,
  eyebrow = "Your Franchise Friend · Ownership Advisor",
}: {
  children: ReactNode;
  right?: ReactNode;
  footer?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="advisor-surface advisor-grid advisor-wave">
      <div className="bg-[#12304C] text-[#F4ECE1] text-[11px] tracking-[0.18em] uppercase text-center py-2.5 px-4">
        {eyebrow}
      </div>
      <header className="border-b border-[var(--advisor-line)]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-5 flex items-center justify-between gap-4">
          <a href="/advisor" className="hover:opacity-80 transition-opacity">
            <AdvisorWordmark />
          </a>
          {right}
        </div>
      </header>
      <main>{children}</main>
      {footer ?? (
        <footer className="border-t border-[var(--advisor-line)] mt-16">
          <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-[#12304C]/70">
            <p>A private conversation. Not a franchise recommendation.</p>
            <div className="flex gap-5">
              <a href="/" className="hover:text-[#12304C]">Franchise Friend</a>
              <a href="/advisor/privacy" className="hover:text-[#12304C]">Privacy</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
