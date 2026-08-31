import { ADVISOR_CHAPTERS, CHAPTER_LABELS, type AdvisorChapter } from "@shared/advisor";

export function ChapterMarker({ chapter }: { chapter: AdvisorChapter | string }) {
  const index = ADVISOR_CHAPTERS.indexOf(chapter as AdvisorChapter);
  const safeIndex = index >= 0 ? index : 0;
  return (
    <div className="flex items-center gap-3" aria-label={`Chapter: ${CHAPTER_LABELS[ADVISOR_CHAPTERS[safeIndex]]}`}>
      <span className="text-[11px] uppercase tracking-[0.18em] text-[#12304C]/70">
        {CHAPTER_LABELS[ADVISOR_CHAPTERS[safeIndex]]}
      </span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {ADVISOR_CHAPTERS.map((item, i) => (
          <span
            key={item}
            className={`h-2 w-2 border border-[#12304C] ${i <= safeIndex ? "bg-[#12304C]" : "bg-transparent"}`}
          />
        ))}
      </div>
    </div>
  );
}
