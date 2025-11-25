import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Trash2, Plus, Check, AlertCircle, Loader } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

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

export default function PodcastAdmin() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audioUrl: "",
    artworkUrl: "",
    duration: "",
    episodeNumber: "",
    youtubeUrl: "",
    spotifyUrl: "",
    applePodcastsUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch podcasts
  const { data: podcastsData, isLoading, refetch } = useQuery({
    queryKey: ["podcasts"],
    queryFn: async () => {
      const response = await fetch("/api/podcasts");
      if (!response.ok) throw new Error("Failed to fetch podcasts");
      return response.json();
    },
  });

  const podcasts: Podcast[] = podcastsData?.podcasts || [];

  // Delete podcast
  const deletePodcast = async (id: string) => {
    if (!confirm("Are you sure you want to delete this podcast?")) return;
    try {
      const response = await fetch(`/api/podcasts/${id}`, { method: "DELETE" });
      if (response.ok) {
        refetch();
        setSubmitMessage({ type: "success", text: "Podcast deleted successfully" });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      setSubmitMessage({ type: "error", text: "Failed to delete podcast" });
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        audioUrl: formData.audioUrl,
        artworkUrl: formData.artworkUrl || undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        episodeNumber: formData.episodeNumber ? parseInt(formData.episodeNumber) : undefined,
        youtubeUrl: formData.youtubeUrl || undefined,
        spotifyUrl: formData.spotifyUrl || undefined,
        applePodcastsUrl: formData.applePodcastsUrl || undefined,
      };

      const response = await fetch("/api/podcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create podcast");
      }

      setSubmitMessage({ type: "success", text: "Podcast uploaded successfully!" });
      setFormData({
        title: "",
        description: "",
        audioUrl: "",
        artworkUrl: "",
        duration: "",
        episodeNumber: "",
        youtubeUrl: "",
        spotifyUrl: "",
        applePodcastsUrl: "",
      });
      refetch();
    } catch (error: any) {
      setSubmitMessage({ type: "error", text: error.message || "Failed to upload podcast" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Podcast Management
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Upload your podcast episodes and automatically generate RSS feeds for Spotify, Apple Podcasts, and more.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-secondary/5 border border-border rounded-lg p-6 text-center">
              <h3 className="font-bold text-primary mb-2">RSS Feed URL</h3>
              <p className="text-sm text-muted-foreground mb-4">Use this URL to submit to podcast platforms:</p>
              <code className="text-xs bg-background p-3 rounded block break-all text-primary">/podcast/feed.xml</code>
            </div>
            <div className="bg-secondary/5 border border-border rounded-lg p-6 text-center">
              <h3 className="font-bold text-primary mb-2">Spotify</h3>
              <p className="text-sm text-muted-foreground">Submit your RSS feed to Spotify for Podcasters</p>
            </div>
            <div className="bg-secondary/5 border border-border rounded-lg p-6 text-center">
              <h3 className="font-bold text-primary mb-2">Apple Podcasts</h3>
              <p className="text-sm text-muted-foreground">Submit RSS feed via Apple Podcasts Connect</p>
            </div>
          </div>

          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-background to-secondary/5 border border-border/50 rounded-2xl p-8 mb-12"
          >
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">Upload New Episode</h2>

            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                submitMessage.type === "success" 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                {submitMessage.type === "success" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                {submitMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Episode Title *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., How to Scale Your Franchise"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    data-testid="input-episode-title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Episode Number
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 1"
                    value={formData.episodeNumber}
                    onChange={(e) => setFormData({ ...formData, episodeNumber: e.target.value })}
                    data-testid="input-episode-number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Episode Description
                </label>
                <Textarea
                  placeholder="Describe your podcast episode..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  data-testid="textarea-description"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Audio File URL * <span className="text-xs text-muted-foreground">(MP3)</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/episode.mp3"
                    value={formData.audioUrl}
                    onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                    required
                    data-testid="input-audio-url"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Artwork URL <span className="text-xs text-muted-foreground">(JPG/PNG)</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/artwork.jpg"
                    value={formData.artworkUrl}
                    onChange={(e) => setFormData({ ...formData, artworkUrl: e.target.value })}
                    data-testid="input-artwork-url"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Duration (seconds)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 1800"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  data-testid="input-duration"
                />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-primary mb-4">Platform Links (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      YouTube Video URL
                    </label>
                    <Input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      data-testid="input-youtube-url"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Spotify Episode URL
                    </label>
                    <Input
                      type="url"
                      placeholder="https://open.spotify.com/episode/..."
                      value={formData.spotifyUrl}
                      onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                      data-testid="input-spotify-url"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
                data-testid="button-submit-podcast"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Episode
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Episodes List */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">Published Episodes</h2>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
              </div>
            ) : podcasts.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground text-lg">No episodes published yet. Upload your first episode above!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {podcasts.map((podcast, index) => (
                  <motion.div
                    key={podcast.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-border/50 hover:border-secondary/30 transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-primary">
                              {podcast.episodeNumber && `Ep. ${podcast.episodeNumber}: `}
                              {podcast.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              Published {new Date(podcast.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => deletePodcast(podcast.id)}
                            className="text-muted-foreground hover:text-red-600 transition-colors"
                            data-testid={`button-delete-podcast-${podcast.id}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {podcast.description && <p>{podcast.description}</p>}
                          {podcast.duration && <p>Duration: {Math.floor(podcast.duration / 60)} min</p>}
                          {podcast.youtubeUrl && (
                            <p>
                              <a href={podcast.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                                YouTube →
                              </a>
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}