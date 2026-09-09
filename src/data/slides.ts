export type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
};

export type CardSlide = {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "ITALIAN GRAND PRIX 2026",
    subtitle: "F1 ON APPLE TV",
    description:
      "Every Grand Prix live and on demand — all in one place, all year long.",
    image: "/images/hero-1.jpg",
    buttonText: "Watch Now",
  },

  {
    id: 2,
    title: "AFTER",
    subtitle: "APPLE TV+",
    description:
      "A new story begins. Discover an unforgettable journey.",
    image: "/images/hero-2.jpg",
    buttonText: "Stream Now",
  },

  {
    id: 3,
    title: "SILENCE",
    subtitle: "APPLE TV+",
    description:
      "The truth lies somewhere in the past.",
    image: "/images/hero-3.jpg",
    buttonText: "Stream Now",
  },
];

export const cardSlides: CardSlide[] = [
  {
    id: 1,
    category: " Music",
    title: "Sabrina Carpenter",
    description: "The Zane Lowe Interview",
    image: "/images/card-1.jpg",
    buttonText: "Listen Now",
  },

  {
    id: 2,
    category: " Arcade",
    title: "Hello Kitty Island Adventure",
    description: "Island Adventure",
    image: "/images/card-2.jpg",
    buttonText: "Play Now",
  },

  {
    id: 3,
    category: " TV+",
    title: "David Bowie",
    description: "A New Chapter",
    image: "/images/card-3.jpg",
    buttonText: "Watch Now",
  },

  {
    id: 4,
    category: " Music",
    title: "A-List Pop",
    description: "Apple Music Pop",
    image: "/images/card-4.jpg",
    buttonText: "Listen Now",
  },

  {
    id: 5,
    category: " Arcade",
    title: "PowerWash Simulator",
    description: "Get Satisfying",
    image: "/images/card-5.jpg",
    buttonText: "Play Now",
  },
];