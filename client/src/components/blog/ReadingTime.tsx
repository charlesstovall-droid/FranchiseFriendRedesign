import { Clock } from "lucide-react";

interface ReadingTimeProps {
  minutes: number;
}

export function ReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <Clock className="w-4 h-4" />
      {minutes} min read
    </span>
  );
}
