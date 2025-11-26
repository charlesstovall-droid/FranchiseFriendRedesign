import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { LogIn, AlertCircle, Download } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/AuthContext";

export default function ClientPortal() {
  const [, setLocation] = useLocation();
  const { refetch } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please check your email and try again.");
        return;
      }

      setSuccess(true);
      // Refresh auth context and redirect to Phase 1
      await refetch();
      setTimeout(() => setLocation("/phase1"), 500);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="py-12 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Client Portal</h1>
          <p className="text-lg text-primary-foreground/80">Access your exclusive franchise discovery tools</p>
        </div>
      </section>

      <section className="py-16 bg-background min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            {/* Free Download */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-secondary/30 bg-secondary/5">
                <CardHeader>
                  <h3 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Free Resource
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-bold text-primary mb-2">The Reality of Business Ownership</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      An honest guide setting real expectations about franchise and business ownership. Covers time commitment, financial realities, common mistakes, and lifestyle expectations.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/api/download/business-reality-book';
                      link.download = 'Business-Reality-Guide.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    data-testid="button-download-reality-guide"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
                  <LogIn className="w-6 h-6" />
                  Member Login
                </h2>
              </CardHeader>
              <CardContent>
                {success ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6"
                  >
                    <p className="text-lg font-semibold text-secondary mb-2">✓ Welcome back!</p>
                    <p className="text-muted-foreground">Redirecting to your dashboard...</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2 text-destructive"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{error}</p>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="member@example.com"
                        required
                        disabled={loading}
                        data-testid="input-email"
                        className="border-secondary/20"
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Enter the email address associated with your membership account. You'll be asked to verify your access.
                    </p>

                    <Button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                      data-testid="button-login"
                    >
                      {loading ? "Logging in..." : "Log In"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account? <br />
              <span className="text-secondary">Reach out to Charles for an exclusive invitation</span>
            </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
