import { Heart } from "lucide-react";

// Issue 3: All whileInView / scroll-reveal animations removed.

import familyOutdoor from "../assets/photos/IMG_2083_1764040291781.jpeg";
import sunsetPorch from "../assets/photos/IMG_1128_1764040291781.jpeg";
import golfingTogether from "../assets/photos/IMG_1100_1764040291781.jpeg";
import porchMoment from "../assets/photos/IMG_1044_1764040291781.jpeg";
import golfCourse from "../assets/photos/IMG_9205_1764040291781.jpeg";

export function MeetCharlesFamily() {
  const photos = [
    { image: familyOutdoor, caption: "Family Adventures", description: "Creating memories with those who matter most" },
    { image: sunsetPorch, caption: "Mountain Moments", description: "Enjoying life's simple pleasures" },
    { image: golfingTogether, caption: "Golf Time", description: "Quality time on the course" },
    { image: porchMoment, caption: "Family Time", description: "Life's best moments are with loved ones" },
    { image: golfCourse, caption: "Outdoor Pursuits", description: "Living life to the fullest" },
  ];

  return (
    <section id="family" className="py-20 bg-gradient-to-b from-secondary/5 to-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
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
        </div>

        {/* Photo Gallery */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all h-64"
              data-testid={`family-photo-${index}`}
            >
              <img
                src={photo.image}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg mb-1">{photo.caption}</h3>
                <p className="text-white/80 text-sm">{photo.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-border/30">
          {[
            { title: "Authenticity", body: "What you see is what you get. I believe in honest conversations and transparent guidance.", gradient: "from-primary to-primary/60", textColor: "text-primary-foreground" },
            { title: "Balance", body: "I understand that building a business doesn't mean sacrificing time with family.", gradient: "from-secondary to-secondary/60", textColor: "text-white" },
            { title: "Partnership", body: "Your success is my success. I'm genuinely invested in helping you find the right fit.", gradient: "from-primary to-primary/60", textColor: "text-primary-foreground" },
          ].map((val, i) => (
            <div key={i} className="text-center">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${val.gradient} flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${val.textColor}`}>✓</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{val.title}</h3>
              <p className="text-muted-foreground">{val.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
