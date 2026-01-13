import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, ExternalLink, Loader } from "lucide-react";

interface Podcast {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  artworkUrl?: string;
  duration?: number;
  episodeNumber?: number;
  youtubeUrl?: string;
  spotifyUrl?: string;
  applePodcastsUrl?: string;
  publishedAt: string;
}

export default function PodcastsPage() {
  const { data: podcastsData, isLoading } = useQuery({
    queryKey: ["podcasts"],
    queryFn: async () => {
      const response = await fetch("/api/podcasts");
      if (!response.ok) throw new Error("Failed to fetch podcasts");
      return response.json();
    },
  });

  const podcasts: Podcast[] = podcastsData?.podcasts || [];

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* JSON-LD for Podcast Episodes */}
      {podcasts.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": podcasts.map((p, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "item": {
                "@type": "PodcastEpisode",
                "name": p.title,
                "description": p.description,
                "url": `https://charlesstovall.com/podcast/${p.id}`,
                "datePublished": p.publishedAt,
                "associatedMedia": {
                  "@type": "MediaObject",
                  "contentUrl": p.audioUrl
                }
              }
            }))
          })}
        </script>
      )}

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Charles Stovall's Podcast
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl">
              Expert insights on franchise consulting, business strategy, and entrepreneurship. Listen to candid conversations with Charles about scaling businesses and building lasting success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {/* Subscribe CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16 p-8 bg-gradient-to-r from-secondary/10 to-primary/5 border border-secondary/20 rounded-2xl"
          >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              Subscribe to Stay Updated
            </h2>
            <p className="text-muted-foreground mb-6">
              Get new episodes delivered to your favorite podcast platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  window.open("https://open.spotify.com/show/", "_blank");
                }}
                data-testid="button-spotify-subscribe"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Spotify
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.open("https://podcasts.apple.com/", "_blank");
                }}
                data-testid="button-apple-subscribe"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Apple Podcasts
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.open("https://www.youtube.com/", "_blank");
                }}
                data-testid="button-youtube-subscribe"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                YouTube
              </Button>
            </div>
          </motion.div>

          {/* Episodes */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading episodes...</p>
              </div>
            </div>
          ) : podcasts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No episodes published yet. Check back soon!
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-12">
                Latest Episodes
              </h2>
              <div className="space-y-6">
                {podcasts.map((podcast, index) => (
                  <motion.div
                    key={podcast.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="border-border/50 hover:border-secondary/30 transition-all overflow-hidden hover:shadow-lg"
                      data-testid={`card-podcast-${podcast.id}`}
                    >
                      <div className="md:flex">
                        {/* Artwork */}
                        <div className="md:w-48 md:h-48 flex-shrink-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-6">
                          {podcast.artworkUrl ? (
                            <img
                              src={podcast.artworkUrl}
                              alt={`Charles Stovall Podcast: ${podcast.title} - Expert franchise insights and advice`}
                              className="w-full h-full object-cover rounded-lg"
                              data-testid={`img-artwork-${podcast.id}`}
                            />
                          ) : (
                            <div className="text-center">
                              <Play className="w-12 h-12 text-primary/40 mx-auto" />
                            </div>
                          )}
                        </div>

                        {/* Episode Details */}
                        <CardContent className="flex-1 pt-6 md:pt-8 md:pr-8">
                          <div className="space-y-4">
                            {/* Episode Title */}
                            <div>
                              {podcast.episodeNumber && (
                                <span className="text-sm font-semibold text-secondary mb-2 inline-block">
                                  EPISODE {podcast.episodeNumber}
                                </span>
                              )}
                              <h3 className="text-2xl font-serif font-bold text-primary mt-2">
                                {podcast.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-2">
                                {formatDate(podcast.publishedAt)}
                                {podcast.duration && ` • ${formatDuration(podcast.duration)}`}
                              </p>
                            </div>

                            {/* Description */}
                            {podcast.description && (
                              <p className="text-muted-foreground leading-relaxed">
                                {podcast.description}
                              </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-border/30">
                              <Button
                                variant="default"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => window.open(podcast.audioUrl, "_blank")}
                                data-testid={`button-play-${podcast.id}`}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Listen
                              </Button>

                              {podcast.spotifyUrl && (
                                <Button
                                  variant="outline"
                                  onClick={() => window.open(podcast.spotifyUrl, "_blank")}
                                  data-testid={`button-spotify-${podcast.id}`}
                                >
                                  Spotify
                                </Button>
                              )}

                              {podcast.youtubeUrl && (
                                <Button
                                  variant="outline"
                                  onClick={() => window.open(podcast.youtubeUrl, "_blank")}
                                  data-testid={`button-youtube-${podcast.id}`}
                                >
                                  YouTube
                                </Button>
                              )}

                              {podcast.applePodcastsUrl && (
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    window.open(podcast.applePodcastsUrl, "_blank")
                                  }
                                  data-testid={`button-apple-${podcast.id}`}
                                >
                                  Apple Podcasts
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}