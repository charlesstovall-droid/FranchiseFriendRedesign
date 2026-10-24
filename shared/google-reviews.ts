/**
 * Google Business Profile aggregate, pulled 2026-10-24.
 * 5.0 stars from 40 reviews. Visible copy and JSON-LD both read these values.
 */
export const GOOGLE_REVIEW_RATING = "5.0";
export const GOOGLE_REVIEW_COUNT = 40;

export interface FeaturedGoogleReview {
  author: string;
  text: string;
}

/**
 * Homepage carousel, newest featured review first.
 * Nishita P, Chad Arsich, and Khamari McGriff are verbatim from the profile.
 * Earlier cards stay as previously published. Rating-only, one-word, and
 * compensation reviews are not included.
 */
export const featuredGoogleReviews: FeaturedGoogleReview[] = [
  {
    author: "Nishita P",
    text: "Charles is amazing to work with! He has incredible hands on experience in a variety of franchises and more importantly, he is generous with his time to share that knowledge with others. We learned so much from him and I really appreciate that he is someone who is not pushy and instead truly wants to help potential franchise owners discover the right opportunity for their needs.",
  },
  {
    author: "Chad Arsich",
    text: "If you're even considering a franchise, Chuck is your man.  Not only is he just a great person, he just gets it.  Super professional, very knowledgeable about franchises (he's been a successful franchise owner and has the street cred), and is not \"salesy\" like other franchise consultants I've encountered.  He's honest, listens to  what your looking for and presents only high end franchises.  Doesn't  just try to push the latest and greatest....100% would refer to any friends or family.  Thanks, Chuck!!",
  },
  {
    author: "Khamari McGriff",
    text: "Charles Stovall was outstanding to work with throughout the franchise process. He was knowledgeable, responsive, and genuinely invested in helping me find the best fit for my goals rather than simply trying to make a sale. His professionalism, honesty, and willingness to answer every question made the experience a great one. I truly appreciate how hard he worked on my behalf and would highly recommend working with him.",
  },
  {
    author: "DK Patel",
    text: "Excellent partner and guide in our journey into the franchise world. We gained valuable exposure to what is suitable and received great advice as we prepared to take a significant step from the corporate world to franchising.",
  },
  {
    author: "Nate F.",
    text: "He's incredibly knowledgeable about franchising, but what really stands out is how much he genuinely cares about helping you find the right fit. He's honest, professional, and patient throughout the entire process. I highly recommend him to anyone considering franchise ownership.",
  },
  {
    author: "Justin Risedorf",
    text: "One of the few business brokers with first-hand experience. Generous with his time and wisdom. Great guy to know and talk to about all things business ownership, franchising, and business acquisition.",
  },
  {
    author: "Brent Ely",
    text: "Charles is a great person with strong morals and that shows in how he works with his customers. He is positive, but also very honest to help you evaluate and make the best decision for you and your family. He draws on a ton of personal experience in the franchising world.",
  },
  {
    author: "Simon Curtis",
    text: "Charles made me millions in just a few years. Best choice I ever made. I have went with other investors in the past and they don't come close to the service and experience you get with him.",
  },
  {
    author: "Brandon Dunevant",
    text: "Charles was helpful pointing out some real potential pitfalls that we wouldn't have seen coming! Highly recommend getting him involved in any high stakes transaction!",
  },
];
