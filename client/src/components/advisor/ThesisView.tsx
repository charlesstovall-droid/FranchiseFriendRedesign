import type { OwnershipThesis } from "@shared/advisor";
import { THESIS_CONCLUSION } from "@shared/advisor";

const KEYS: Array<keyof OwnershipThesis> = [
  "whyOwnershipIsBeingConsidered",
  "whatCandidateWantsOwnershipToCreate",
  "recommendedOwnerRole",
  "financialFramework",
  "businessCharacteristicsThatMayFit",
  "businessCharacteristicsToApproachCarefully",
  "strengthsTheCandidateBrings",
  "potentialConflictsOrBlindSpots",
  "questionsStillRequiringHumanJudgment",
  "recommendedNextStep",
];

export function ThesisView({ thesis }: { thesis: OwnershipThesis }) {
  return (
    <article className="space-y-10">
      {KEYS.map((key, i) => {
        const section = thesis[key];
        if (!section || typeof section !== "object" || !("body" in section)) return null;
        return (
          <section key={key} className="advisor-enter border-t border-[var(--advisor-line)] pt-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#12304C]/55 mb-2">0{i + 1}</p>
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
              <h2 className="advisor-display text-2xl md:text-3xl">{section.title}</h2>
              {section.indicator ? (
                <span className="text-[11px] uppercase tracking-[0.16em] border border-[#12304C]/25 px-2.5 py-1">
                  {section.indicator}
                </span>
              ) : null}
            </div>
            <p className="text-[17px] leading-8 text-[#12304C]/90 whitespace-pre-wrap">{section.body}</p>
          </section>
        );
      })}
      {thesis.namedBrands?.length ? (
        <section className="border-t border-[var(--advisor-line)] pt-8">
          <h2 className="advisor-display text-2xl mb-4">Options to investigate</h2>
          <div className="space-y-5">
            {thesis.namedBrands.map((brand) => (
              <div key={brand.name} className="border border-[var(--advisor-line)] p-5">
                <p className="advisor-display text-xl">{brand.name}</p>
                <p className="mt-2 leading-7">{brand.reason}</p>
                <p className="mt-3 text-sm text-[#12304C]/70">{brand.disclaimer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <p className="advisor-display text-xl leading-8 pt-4">{thesis.conclusion || THESIS_CONCLUSION}</p>
    </article>
  );
}
