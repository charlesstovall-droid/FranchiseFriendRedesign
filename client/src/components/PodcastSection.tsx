// Issue 9: Replaced full podcast section with a single thin strip.
// Stats (100+ Episodes, 5k+ Listeners) removed from this location.
// Strip is placed just above the footer in home.tsx.

// TODO Charles: verify Spotify, Apple, YouTube podcast URLs below are correct.
const podcastLinks = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/search/your%20franchise%20friend",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    label: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/your-franchise-friend/id1500000000",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zm0 2.4a7.2 7.2 0 100 14.4A7.2 7.2 0 0012 4.8zm0 1.6a5.6 5.6 0 110 11.2A5.6 5.6 0 0112 6.4zm0 2a3.6 3.6 0 100 7.2 3.6 3.6 0 000-7.2zm0 1.6a2 2 0 110 4 2 2 0 010-4z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@yourfranchisefriend",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

export function PodcastSection() {
  return (
    <div className="py-4 border-t border-border/30 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-medium text-center sm:text-left">
            As heard on the{" "}
            <a
              href="https://www.franchisefriend.net/podcast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:text-secondary transition-colors"
            >
              Franchise Friend Podcast
            </a>
          </p>
          <div className="flex items-center gap-5">
            {podcastLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-muted-foreground grayscale hover:grayscale-0 hover:text-primary transition-all duration-200"
                data-testid={`podcast-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
