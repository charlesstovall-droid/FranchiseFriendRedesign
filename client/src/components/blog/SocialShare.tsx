import { Linkedin, Twitter, Facebook, Share2 } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
  variant?: "horizontal" | "vertical";
}

export function SocialShare({ url, title, variant = "horizontal" }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:text-[#0077B5] hover:bg-[#0077B5]/10"
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-[#4267B2] hover:bg-[#4267B2]/10"
    }
  ];

  const containerClass = variant === "vertical" 
    ? "flex flex-col items-center gap-2" 
    : "flex items-center gap-3";

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </div>
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg text-muted-foreground transition-colors ${link.color}`}
            title={`Share on ${link.name}`}
            data-testid={`share-${link.name.toLowerCase()}`}
          >
            <link.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
    </div>
  );
}
