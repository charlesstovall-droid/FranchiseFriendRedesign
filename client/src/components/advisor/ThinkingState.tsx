export function ThinkingState({ name }: { name?: string | null }) {
  return (
    <div className="advisor-enter py-10" role="status" aria-live="polite">
      <p className="text-sm uppercase tracking-[0.18em] text-[#12304C]/60 mb-4">
        {name ? `Listening to ${name}` : "Listening"}
      </p>
      <div className="h-px w-full bg-[#12304C]/10 overflow-hidden">
        <div className="advisor-listen-bar h-px bg-[#F2C740]" />
      </div>
      <p className="advisor-display text-xl md:text-2xl mt-6 text-[#12304C]">
        Considering what you said, and the tension underneath it.
      </p>
    </div>
  );
}
