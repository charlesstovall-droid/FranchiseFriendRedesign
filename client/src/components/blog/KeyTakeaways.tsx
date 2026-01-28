import { Lightbulb, Check } from "lucide-react";

interface KeyTakeawaysProps {
  takeaways: string[];
}

export function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div className="bg-accent-pop/10 border-l-4 border-accent-pop rounded-r-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-accent-pop" />
        <h2 className="text-lg font-bold text-primary">Key Takeaways</h2>
      </div>
      <ul className="space-y-3">
        {takeaways.map((takeaway, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-accent-pop mt-0.5 flex-shrink-0" />
            <span className="text-foreground">{takeaway}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
