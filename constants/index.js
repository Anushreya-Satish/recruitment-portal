import {
  ManageAccounts,
  Trophy,
  Campaign,
  ConnectWithoutContact,
  DesignServices,
  Palette,
  Language,
  Mobile2,
  SportsEsports,
  Analytics,
  Hub,
  Cloud,
} from "@material-symbols-svg/react/outlined";

export const curDay = new Date().getDay();
export const curYear = new Date().getFullYear();
export const curDate = new Date().getDate();
export const curMonth = new Date().getMonth();

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const days = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export const LINKS = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
  discord: process.env.NEXT_PUBLIC_DISCORD_URL || "#",
  gmail: process.env.NEXT_PUBLIC_GMAIL_URL || "#",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
  x: process.env.NEXT_PUBLIC_X_URL || "#",
};

// Clear Department Specifications
export const reviews = [
  {
    id: "c21ca066-ab4d-40a3-943c-f170d6312bdc",
    icon: ManageAccounts,
    tone: "#8ab4f8",
    name: "Management",
    body: "Oversees operations, project timelines, and logistical coordination across all active initiatives.",
  },
  {
    id: "4499a966-2740-4c36-88dd-8916a909fc77",
    icon: Campaign,
    tone: "#FF7A6B",
    name: "Publicity",
    body: "Drives community engagement and outreach through strategic media campaigns.",
  },
  {
    id: "3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
    icon: ConnectWithoutContact,
    tone: "#FFD45E",
    name: "Outreach",
    body: "Establishes external partnerships, sponsorships, and organizational opportunities.",
  },
  {
    id: "e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
    icon: DesignServices,
    tone: "#FF7A6B",
    name: "UI/UX Design",
    body: "Creates accessible, user-centric interfaces and interactive user flow experiences.",
  },
  {
    id: "d3beefc1-f8b0-4202-b26c-36e9804b6636",
    icon: Palette,
    tone: "#FFD45E",
    name: "Design",
    body: "Crafts visual brand identity, marketing collateral, and digital media assets.",
  },
  {
    id: "8143de1d-db17-42fa-958d-13b10804f894",
    icon: Language,
    tone: "#8AB4F8",
    name: "Web Development",
    body: "Designs and maintains responsive web applications and full-stack web platforms.",
  },
  {
    id: "339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
    icon: Mobile2,
    tone: "#6EE7A0",
    name: "App Development",
    body: "Builds cross-platform mobile apps focused on seamless user experiences.",
  },
  {
    id: "9055864f-c7dc-44cd-91d5-8759d32a496a",
    icon: SportsEsports,
    tone: "#FF7A6B",
    name: "Game Development",
    body: "Explores graphics engines, interactive mechanics, and game design principles.",
  },
  {
    id: "c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
    icon: Analytics,
    tone: "#8AB4F8",
    name: "Data Science",
    body: "Applies machine learning, predictive analytics, and statistical algorithms to real datasets.",
  },
  {
    id: "a1d920df-9eb9-49eb-b3a4-e4a3d1245ede",
    icon: Cloud,
    tone: "#FFD45E",
    name: "Cloud & DevOps",
    body: "Manages containerization, automated deployment pipelines, and cloud computing architectures.",
  },
  {
    id: "6a89c4e2-7b19-4f32-821e-9821a41b5201",
    icon: Hub,
    tone: "#FF7A6B",
    name: "Blockchain",
    body: "Builds smart contracts and decentralized Web3 applications.",
  },
  {
    id: "3e9ac635-01d4-495e-aa87-a7335a2403c2",
    icon: Trophy,
    tone: "#6EE7A0",
    name: "Competitive Programming",
    body: "Focuses on algorithmic efficiency, data structures, and problem-solving strategies.",
  },
];

// Department Cards Export
export const technicalCards = [
  {
    title: "Blockchain",
    description: "Explores decentralized apps, smart contracts, and Web3 development.",
    color: "#FF7A6B",
    image: "/assets/images/icons/blockchain.svg",
    formLink: "/6a89c4e2-7b19-4f32-821e-9821a41b5201",
  },
  {
    title: "Cloud &\nDevOps",
    description: "Explores cloud infrastructure, automated pipelines, and containerization.",
    color: "#FBBC04",
    image: "/assets/images/icons/cloud.svg",
    formLink: "/a1d920df-9eb9-49eb-b3a4-e4a3d1245ede",
  },
  {
    title: "Game Dev",
    description: "Combines creative design and real-world game engine workflows.",
    color: "#4285F4",
    image: "/assets/images/icons/game-dev.svg",
    formLink: "/9055864f-c7dc-44cd-91d5-8759d32a496a",
  },
  {
    title: "App Dev",
    description: "Builds mobile applications to enhance user convenience and interaction.",
    color: "#EA4335",
    image: "/assets/images/icons/app-dev.svg",
    formLink: "/339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
  },
  {
    title: "UI/UX",
    description: "Designs intuitive, accessible, and meaningful user interface experiences.",
    color: "#0F9D58",
    image: "/assets/images/icons/ui-ux.svg",
    formLink: "/e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
  },
  {
    title: "Data\nScience",
    description: "Applies machine learning models and data analytics to yield actionable insights.",
    color: "#EA4335",
    image: "/assets/images/icons/data-science.svg",
    formLink: "/c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
  },
  {
    title: "Competitive Programming",
    description: "Sharpens algorithmic logic through coding challenges and hackathons.",
    color: "#0F9D58",
    image: "/assets/images/icons/cp.svg",
    formLink: "/3e9ac635-01d4-495e-aa87-a7335a2403c2",
  },
  {
    title: "Web Dev",
    description: "Designs and maintains responsive, performant web solutions.",
    color: "#FBBC04",
    image: "/assets/images/icons/web-dev.svg",
    formLink: "/8143de1d-db17-42fa-958d-13b10804f894",
  },
];

export const nonTechnicalCards = [
  {
    title: "Design",
    description: "Creates visual communications, posters, and brand assets for events.",
    color: "#329A4E",
    image: "/assets/images/icons/design.svg",
    formLink: "/d3beefc1-f8b0-4202-b26c-36e9804b6636",
  },
  {
    title: "Outreach",
    description: "Builds partnerships and bridges connections with sponsors and campus communities.",
    color: "#4285F4",
    image: "/assets/images/icons/outreach.svg",
    formLink: "/3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
  },
  {
    title: "Publicity",
    description: "Manages social media channels, campaigns, and community engagement.",
    color: "#EA4335",
    image: "/assets/images/icons/social-media.svg",
    formLink: "/4499a966-2740-4c36-88dd-8916a909fc77",
  },
  {
    title: "Management",
    description: "Coordinates logistics, operations, and execution of organizational goals.",
    color: "#FBBC04",
    image: "/assets/images/icons/management.svg",
    formLink: "/c21ca066-ab4d-40a3-943c-f170d6312bdc",
  },
];