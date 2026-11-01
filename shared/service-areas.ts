/** Neighborhoods Charles actually serves around Mount Pleasant and Charleston. */

export const mountPleasantNeighborhoods = [
  "I'On",
  "Park West",
  "Point Hope",
  "Carolina Park",
  "Shem Creek",
  "Old Village",
] as const;

export const charlestonAreaPlaces = [
  "Daniel Island",
  "Isle of Palms",
  "Sullivan's Island",
  "West Ashley",
  "James Island",
  "Summerville",
] as const;

export const cityPageLinks = [
  { href: "/charleston", label: "Franchise Consultant Charleston SC" },
  { href: "/mount-pleasant", label: "Franchise Consultant Mount Pleasant SC" },
  { href: "/south-carolina", label: "Franchise Consultant South Carolina" },
] as const;

export interface ServingCopy {
  heading: string;
  intro: string;
}

export const mountPleasantServing: ServingCopy = {
  heading: "The neighborhoods buyers actually name",
  intro:
    "I live in Mount Pleasant. When someone says the town, they usually mean one of these neighborhoods. The second list is still my drive, and it is not the same territory.",
};

export const charlestonServing: ServingCopy = {
  heading: "The neighborhoods buyers actually name",
  intro:
    "I live in Mount Pleasant and I work the Charleston market around it. Name the neighborhood. A metro ring is not a territory.",
};
