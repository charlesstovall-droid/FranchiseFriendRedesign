import { ContactForm } from "@/components/ContactForm";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 right-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              Ready to Start Your <br />
              <span className="text-secondary">Franchise Journey?</span>
            </h2>
            
            <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
              Book a complimentary consultation with Charles to discuss your goals, 
              financial position, and find the perfect franchise opportunity for you.
            </p>

            <ul className="space-y-3 text-primary-foreground/90">
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold">✓</span>
                <span>No-obligation consultation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold">✓</span>
                <span>Personalized franchise recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold">✓</span>
                <span>Expert financial guidance</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-background/95 backdrop-blur p-8 rounded-2xl shadow-2xl">
              <p className="text-secondary uppercase text-xs font-bold tracking-widest mb-2">
                Your Franchise Friend™
              </p>
              <h3 className="text-2xl font-serif font-bold text-primary mb-6">
                Schedule Time with Charles
              </h3>
              <ContactForm 
                leadType="consultation" 
                buttonText="Request Consultation"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}