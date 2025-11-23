import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface ContactFormProps {
  leadType: "consultation" | "general" | "newsletter";
  buttonText?: string;
  compact?: boolean;
}

export function ContactForm({ leadType, buttonText = "Submit", compact = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { toast } = useToast();

  const submitLead = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          leadType,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll be in touch soon.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate(formData);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
        <Input
          type="email"
          placeholder="Your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          data-testid="input-email"
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={submitLead.isPending}
          data-testid="button-submit"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          {submitLead.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : buttonText}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          data-testid="input-name"
        />
      </div>
      
      <div>
        <Input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          data-testid="input-email"
        />
      </div>
      
      <div>
        <Input
          type="tel"
          placeholder="Phone Number (Optional)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          data-testid="input-phone"
        />
      </div>
      
      <div>
        <Textarea
          placeholder="Tell us about your goals and interests..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          data-testid="textarea-message"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold"
        disabled={submitLead.isPending}
        data-testid="button-submit"
      >
        {submitLead.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
}