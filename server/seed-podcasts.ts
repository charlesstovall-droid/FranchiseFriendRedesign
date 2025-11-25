import { db } from "./db";
import { podcasts } from "@shared/schema";

const podcastData = [
  {
    title: "There's an Art to This: Building Drawers and a Dream in Charleston",
    description: "Catch the latest Franchise Friend Podcast featuring The Art of Drawers Charleston — we unpack what it really takes to scale craftsmanship into a thriving brand.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "https://images.squarespace-cdn.com/content/v1/5ff08af496a9ec7fa13cf7f5/1761575432475-5Q09K1DVVI0WWI1WRPBD/AOD+Cover.png",
    episodeNumber: 1,
    youtubeUrl: "https://www.youtube.com/channel/UC1PDTh8h8YAo9SDynONljcA",
    publishedAt: new Date("2025-10-21"),
  },
  {
    title: "Charleston's Secret Weapon for Sellers - HomeStretch with Ian Ouellette",
    description: "In this episode, I sit down with Ian Ouellette, founder of HomeStretch Charleston, to talk about how home preparation services are changing the game for homeowners and real estate professionals. From tackling those 'make-ready' projects before a home hits the market to maximizing curb appeal and buyer interest, Ian shares why the details matter and how HomeStretch takes the stress out of selling.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "https://images.squarespace-cdn.com/content/v1/5ff08af496a9ec7fa13cf7f5/1759502877743-37O1EDKMDO0NXQ9XD563/HomeStretch+Post.png",
    episodeNumber: 2,
    youtubeUrl: "https://www.youtube.com/watch?v=5VYJFjOYNjM",
    publishedAt: new Date("2025-09-30"),
  },
  {
    title: "GameDay Mens Health with Tyler Riggins",
    description: "Kicked it with Tyler Riggins to talk all things Gameday Men's Health and the reality of franchise ownership. From navigating partnerships to the lessons of year one, this convo is packed with insight.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "https://images.squarespace-cdn.com/content/v1/5ff08af496a9ec7fa13cf7f5/1757347270763-GXIPRZGUIERL9JMMDQ19/Post+1+%282%29+copy.png",
    episodeNumber: 3,
    youtubeUrl: "https://youtu.be/AkHllFmK0wk",
    publishedAt: new Date("2025-09-08"),
  },
  {
    title: "HOMEStretch with Nick Lobert and Derek Shewmon",
    description: "A conversation about HOMEStretch and the franchise opportunity in home preparation services.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "https://images.squarespace-cdn.com/content/v1/5ff08af496a9ec7fa13cf7f5/1710249902908-QJIS27UVNFULC9M1ZNTC/Screen+Shot+2024-03-12+at+8.55.01+AM.png",
    episodeNumber: 4,
    publishedAt: new Date("2024-03-12"),
  },
  {
    title: "Dina Readinger a Franchisee with Zoomin Groomin",
    description: "Learn about franchise ownership from Dina Readinger and her experience with Zoomin Groomin.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "",
    episodeNumber: 5,
    publishedAt: new Date("2023-11-30"),
  },
  {
    title: "Alexandra Pomponio with Patrice and Associates",
    description: "An interview with Alexandra Pomponio discussing franchise opportunities with Patrice and Associates.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "",
    episodeNumber: 6,
    publishedAt: new Date("2023-10-17"),
  },
  {
    title: "Patrick Guillory with Kidokinetics",
    description: "Patrick Guillory shares insights about Kidokinetics and the franchise business.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "",
    episodeNumber: 7,
    publishedAt: new Date("2023-10-06"),
  },
  {
    title: "Ian Foster with Sculpture Hospitality",
    description: "A deep dive into Sculpture Hospitality with founder Ian Foster, discussing franchise opportunities in the hospitality industry.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "https://images.squarespace-cdn.com/content/v1/5ff08af496a9ec7fa13cf7f5/1693242346972-87OO8RVLH1HPSOVGC971/Podcast-ThumbnailsArtboard-2.png",
    episodeNumber: 8,
    publishedAt: new Date("2023-08-28"),
  },
  {
    title: "Cody Herndon Multi-Unit Franchisee with Urban Air, Little Gym, and Fat Tuesday",
    description: "Cody Herndon shares his experience as a multi-unit franchisee operating Urban Air, Little Gym, and Fat Tuesday locations.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "https://images.squarespace-cdn.com/content/v1/5ff08af496a9ec7fa13cf7f5/1690825374679-HBJ4KMP2LXYEAPO0SMCO/Screen+Shot+2023-07-31+at+1.42.44+PM.png",
    episodeNumber: 9,
    publishedAt: new Date("2023-07-28"),
  },
  {
    title: "Tera Thomas with FranFund",
    description: "Tera Thomas from FranFund discusses franchise financing and investment opportunities.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "https://images.squarespace-cdn.com/content/v1/5ff08af496a9ec7fa13cf7f5/1664989645880-3T722HO5CR5P6S7899Q9/Artboard+2.png",
    episodeNumber: 10,
    publishedAt: new Date("2022-10-05"),
  },
  {
    title: "Mark Titcomb",
    description: "An episode featuring Mark Titcomb discussing franchise insights and business strategy.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "https://images.squarespace-cdn.com/content/v1/5ff08af496a9ec7fa13cf7f5/1665079745930-RTL9JV59KJ8OBQA8RFA2/Podcast-ThumbnailsArtboard-1.png",
    episodeNumber: 11,
    publishedAt: new Date("2022-09-16"),
  },
  {
    title: "Jen Olson",
    description: "Jen Olson with BrandOne speaks about the Spa Industry and franchise opportunities.",
    audioUrl: "", // Need actual audio URL
    artworkUrl: "https://images.squarespace-cdn.com/content/v1/5ff08af496a9ec7fa13cf7f5/1665079807673-QK8FT44LBOAARD9QVDKM/Podcast-ThumbnailsArtboard-2.png",
    episodeNumber: 12,
    publishedAt: new Date("2019-03-11"),
  },
];

async function seedPodcasts() {
  try {
    console.log("Starting podcast seeding...");
    
    // Filter out episodes with empty audio URLs
    const validEpisodes = podcastData.filter(ep => ep.audioUrl);
    
    if (validEpisodes.length === 0) {
      console.log("⚠️  No episodes have audio URLs. Please provide the audio file locations for your podcast episodes.");
      console.log("\nEpisodes waiting for audio URLs:");
      podcastData.forEach(ep => {
        console.log(`  - ${ep.title}`);
      });
      return;
    }

    const result = await db.insert(podcasts).values(validEpisodes);
    console.log(`✅ Successfully seeded ${validEpisodes.length} podcast episodes`);
  } catch (error) {
    console.error("Error seeding podcasts:", error);
  }
}

seedPodcasts();
