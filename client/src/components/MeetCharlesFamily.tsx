import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// Import all family photos
import familyOutdoor from "../assets/photos/IMG_2083_1764040291781.jpeg";
import sunsetPorch from "../assets/photos/IMG_1128_1764040291781.jpeg";
import golfingTogether from "../assets/photos/IMG_1100_1764040291781.jpeg";
import porchMoment from "../assets/photos/IMG_1044_1764040291781.jpeg";
import golfCourse from "../assets/photos/IMG_9205_1764040291781.jpeg";

export function MeetCharlesFamily() {
  const photos = [
    {
      image: familyOutdoor,
      caption: "Family Adventures",
      description: "Creating memories with those who matter most"
    },
    {
      image: sunsetPorch,
      caption: "Mountain Moments",
      description: "Enjoying life's simple pleasures"
    },
    {
      image: golfingTogether,
      caption: "Golf Time",
      description: "Quality time on the course"
    },
    {
      image: porchMoment,
      caption: "Family Time",
      description: "Life's best moments are with loved ones"
    },
    {
      image: golfCourse,
      caption: "Outdoor Pursuits",
      description: "Living life to the fullest"
    }
  ];

  return (
    <section id="family" className="py-20 bg-gradient-to-b from-secondary/5 to-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-secondary fill-secondary" />
            <p className="text-secondary uppercase text-sm font-bold tracking-widest">
              Real Person. Real Family.
            </p>
            <Heart className="w-6 h-6 text-secondary fill-secondary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-4">
            Meet the Stovall Family
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I'm not just a franchise consultant—I'm a husband, father, and someone who believes in building meaningful relationships. 
            My success comes from understanding that business is personal.
          </p>
        </motion.div>

        {/* Photo Gallery */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all h-64"
            >
              <img
                src={photo.image}
                alt={photo.caption}
                data-testid={`family-photo-${index}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg mb-1">{photo.caption}</h3>
                <p className="text-white/80 text-sm">{photo.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-border/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">✓</span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Authenticity</h3>
            <p className="text-muted-foreground">
              What you see is what you get. I believe in honest conversations and transparent guidance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">✓</span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Balance</h3>
            <p className="text-muted-foreground">
              I understand that building a business doesn't mean sacrificing time with family.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">✓</span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Partnership</h3>
            <p className="text-muted-foreground">
              Your success is my success. I'm genuinely invested in helping you find the right fit.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}