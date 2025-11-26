import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Copy, Check, AlertCircle, Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { useLocation } from "wouter";

interface Invitation {
  id: string;
  email: string;
  invitationCode: string;
  isUsed: boolean;
  createdAt: string;
}

export default function MembersAdmin() {
  const { member, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Check if user is authorized
  useEffect(() => {
    if (!loading && (!member || member.email !== "charles@franchisefriend.net")) {
      setLocation("/client-portal");
    }
  }, [loading, member, setLocation]);

  // Fetch invitations
  const { data: invitationsData, refetch } = useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const response = await fetch("/api/invitations");
      if (!response.ok) throw new Error("Failed to fetch invitations");
      return response.json();
    },
  });

  const invitations: Invitation[] = invitationsData?.invitations || [];
  const pendingInvitations = invitations.filter(inv => !inv.isUsed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    setGeneratedCode(null);

    try {
      const response = await fetch("/api/invitations/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create invitation");
      }

      const data = await response.json();
      setSubmitMessage({ type: "success", text: `Invitation created for ${email}` });
      setGeneratedCode(data.invitation.invitationCode);
      setEmail("");
      setName("");
      refetch();
    } catch (error: any) {
      setSubmitMessage({ type: "error", text: error.message || "Failed to create invitation" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!member || member.email !== "charles@franchisefriend.net") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-5xl font-serif font-bold mb-4">Member Management</h1>
          <p className="text-lg text-primary-foreground/80">Create invitations for new clients</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Create Invitation Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-secondary" />
                    Add New Member
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {submitMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg flex gap-2 ${
                          submitMessage.type === "success"
                            ? "bg-green-500/10 border border-green-500/20 text-green-700"
                            : "bg-destructive/10 border border-destructive/20 text-destructive"
                        }`}
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{submitMessage.text}</p>
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
                        disabled={isSubmitting}
                        data-testid="input-member-email"
                        className="border-secondary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Name
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Smith"
                        required
                        disabled={isSubmitting}
                        data-testid="input-member-name"
                        className="border-secondary/20"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !email || !name}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                      data-testid="button-create-invitation"
                    >
                      {isSubmitting ? "Creating..." : "Generate Invitation"}
                    </Button>
                  </form>

                  {generatedCode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg"
                    >
                      <p className="text-sm text-muted-foreground mb-3">Share this code with the member:</p>
                      <div className="flex gap-2 items-center">
                        <code className="flex-1 p-3 bg-background border border-secondary/20 rounded text-center font-mono font-bold text-primary">
                          {generatedCode}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyToClipboard}
                          className="flex-shrink-0"
                          data-testid="button-copy-code"
                        >
                          {copiedCode ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        They'll use this code on the Client Portal to activate their membership
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Pending Invitations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingInvitations.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No pending invitations</p>
                    ) : (
                      pendingInvitations.map((inv, idx) => (
                        <motion.div
                          key={inv.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg"
                        >
                          <p className="text-sm font-semibold text-primary truncate">{inv.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Created {new Date(inv.createdAt).toLocaleDateString()}
                          </p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
