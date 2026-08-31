export function AdvisorMark({ size = 44 }: { size?: number }) {
  return (
    <img
      src="/cs-shield-logo.png"
      alt="Charles Stovall"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

export function AdvisorWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <AdvisorMark size={compact ? 36 : 44} />
      <div className="flex flex-col gap-1">
        <span className="advisor-display font-bold text-[15px] leading-none tracking-tight">Charles Stovall</span>
        <span className="text-[9px] uppercase tracking-[0.22em] text-[#12304C]/70 font-semibold">Your Franchise Friend</span>
      </div>
    </div>
  );
}
