import { useEffect, useState } from "react";
import { AdvisorAdminFrame } from "./advisor-layout";
import { advisorJson } from "@/lib/advisor-api";

export default function AdvisorAdminSettings() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    advisorJson<{ settings: Record<string, unknown> }>("/api/advisor/admin/settings")
      .then((data) => setText(JSON.stringify(data.settings, null, 2)))
      .catch(() => undefined);
  }, []);

  return (
    <AdvisorAdminFrame>
      <h1 className="advisor-display text-4xl mb-3">Copy and prompts</h1>
      <p className="text-sm text-[#12304C]/65 mb-6 max-w-2xl">
        Edit candidate-facing copy, system instructions, chapter prompts, suggested buttons, booking link, and follow-up email templates. Save valid JSON.
      </p>
      <textarea
        className="w-full min-h-[480px] bg-transparent border border-[var(--advisor-line)] p-4 font-mono text-xs leading-5"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4 flex gap-3 items-center">
        <button
          type="button"
          className="bg-[#12304C] text-[#F4ECE1] px-4 py-2 text-sm"
          onClick={async () => {
            try {
              const settings = JSON.parse(text);
              await advisorJson("/api/advisor/admin/settings", { method: "PUT", body: JSON.stringify({ settings }) });
              setMessage("Saved.");
            } catch {
              setMessage("JSON is not valid.");
            }
          }}
        >
          Save
        </button>
        <span className="text-sm">{message}</span>
      </div>
    </AdvisorAdminFrame>
  );
}
