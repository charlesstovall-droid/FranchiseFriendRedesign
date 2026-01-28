import { List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  headings: TOCItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav className="bg-secondary/5 border border-secondary/20 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-secondary" />
        <h2 className="text-lg font-bold text-primary">Table of Contents</h2>
      </div>
      <ol className="space-y-2 list-decimal list-inside">
        {headings.map((heading, index) => (
          <li key={index} className="text-muted-foreground">
            <a
              href={`#${heading.id}`}
              className="text-secondary hover:text-accent-pop transition-colors hover:underline"
              data-testid={`toc-link-${heading.id}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
