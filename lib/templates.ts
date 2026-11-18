export const categories = [
  "Traditional Christmas",
  "Minimal Christmas",
  "Modern Christmas",
  "Cute & Cartoon",
  "Religious Christmas",
  "Elegant Christmas",
  "Family Christmas",
  "Funny Christmas",
] as const;

export type Category = (typeof categories)[number];

export type Template = {
  id: string;
  name: string;
  category: Category | string;
  tagline: string;
  mood: string;
};

export const templates: Template[] = [
  {
    id: "holly-ribbon",
    name: "Holly Ribbon",
    category: "Traditional Christmas",
    tagline: "Red ribbon, green holly, and a wish written in ink.",
    mood: "Classic",
  },
  {
    id: "victorian-post",
    name: "Victorian Post",
    category: "Traditional Christmas",
    tagline: "A cream envelope from a slower century.",
    mood: "Heritage",
  },
  {
    id: "ivory-type",
    name: "Ivory Type",
    category: "Minimal Christmas",
    tagline: "One line of type, and all the quiet around it.",
    mood: "Quiet",
  },
  {
    id: "pine-line",
    name: "Pine Line",
    category: "Minimal Christmas",
    tagline: "A single spruce, drawn with almost nothing.",
    mood: "Spare",
  },
  {
    id: "colour-block",
    name: "Colour Block",
    category: "Modern Christmas",
    tagline: "Berry, pine, and gold in clean blocks.",
    mood: "Graphic",
  },
  {
    id: "glass-ornament",
    name: "Glass Ornament",
    category: "Modern Christmas",
    tagline: "A bauble caught in winter light.",
    mood: "Polished",
  },
  {
    id: "cocoa-mug",
    name: "Cocoa Mug",
    category: "Cute & Cartoon",
    tagline: "Marshmallows, mittens, and a very round hello.",
    mood: "Sweet",
  },
  {
    id: "robin-round",
    name: "Robin Round",
    category: "Cute & Cartoon",
    tagline: "A small robin who has claimed the greeting.",
    mood: "Playful",
  },
  {
    id: "bethlehem-star",
    name: "Bethlehem Star",
    category: "Religious Christmas",
    tagline: "A bright star over a still, humble night.",
    mood: "Sacred",
  },
  {
    id: "midnight-gold",
    name: "Midnight Gold",
    category: "Elegant Christmas",
    tagline: "A quiet night, lettered in gold.",
    mood: "Elegant",
  },
  {
    id: "family-table",
    name: "Family Table",
    category: "Family Christmas",
    tagline: "Extra chairs, one more place, everyone home.",
    mood: "Warm",
  },
  {
    id: "nice-list",
    name: "Nice List, Barely",
    category: "Funny Christmas",
    tagline: "Official notice: you made the list. Mostly.",
    mood: "Witty",
  },
];

export const designIds = templates.map((template) => template.id);

export function getTemplate(id: string) {
  return templates.find((template) => template.id === id);
}

export const sampleWishes = [
  "May your Christmas be unhurried, bright, and full of the people who feel like home.",
  "Wishing you a table that stays full, a fire that stays lit, and a year that feels kinder.",
  "However far apart we are tonight, you are very much in this house.",
];
