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
    id: "nice-list",
    name: "Nice List, Barely",
    category: "Funny Christmas",
    tagline: "Official notice: you made the list. Mostly.",
    mood: "Witty",
  },
  {
    id: "gingerbread-gift",
    name: "Gingerbread Gift",
    category: "Cute & Cartoon",
    tagline: "Bells, gingerbread, and a present tied in red.",
    mood: "Sweet",
  },
  {
    id: "warm-bench",
    name: "Warm Bench",
    category: "Traditional Christmas",
    tagline: "A tree, a dog, and a quiet Merry Christmas.",
    mood: "Classic",
  },
  {
    id: "ribbon-wreath",
    name: "Ribbon Wreath",
    category: "Traditional Christmas",
    tagline: "A wreath on striped paper, with room for a note behind it.",
    mood: "Classic",
  },
  {
    id: "woodland",
    name: "Woodland",
    category: "Traditional Christmas",
    tagline: "Trees, a deer, and a bright new year.",
    mood: "Gentle",
  },
  {
    id: "gift-box",
    name: "Gift Box",
    category: "Cute & Cartoon",
    tagline: "A red present, holly, and a bright Merry Christmas.",
    mood: "Cheerful",
  },
  {
    id: "pine-gnome",
    name: "Pine Gnome",
    category: "Cute & Cartoon",
    tagline: "A green gnome under a border of pine.",
    mood: "Sweet",
  },
  {
    id: "cozy-bear",
    name: "Cozy Bear",
    category: "Cute & Cartoon",
    tagline: "A waving bear that drops out of its red frame.",
    mood: "Sweet",
  },
  {
    id: "flake-grid",
    name: "Snowflake Grid",
    category: "Modern Christmas",
    tagline: "Nine snowflakes flip over, one tile at a time.",
    mood: "Bright",
  },
  {
    id: "nutcracker",
    name: "Nutcracker",
    category: "Traditional Christmas",
    tagline: "A nutcracker whose cover swings open from the middle.",
    mood: "Festive",
  },
  {
    id: "reindeer-pair",
    name: "Reindeer Pair",
    category: "Cute & Cartoon",
    tagline: "Two reindeer, then a circle closes onto your note.",
    mood: "Sweet",
  },
  {
    id: "night-street",
    name: "Night Street",
    category: "Cute & Cartoon",
    tagline: "The street lifts into the night to show your note.",
    mood: "Quiet",
  },
  {
    id: "snow-village",
    name: "Snow Village",
    category: "Cute & Cartoon",
    tagline: "The sky lifts and the snow sinks to show your note.",
    mood: "Gentle",
  },
  {
    id: "ribbon-tree",
    name: "Ribbon Tree",
    category: "Elegant Christmas",
    tagline: "A candle tree that comes out of an envelope.",
    mood: "Quiet",
  },
  {
    id: "gold-snow",
    name: "Gold Snow",
    category: "Elegant Christmas",
    tagline: "A moving cover spins away onto gold snowflakes.",
    mood: "Quiet",
  },
  {
    id: "watercolor-santa",
    name: "Watercolor Santa",
    category: "Cute & Cartoon",
    tagline: "Santa turns aside from the right, onto your wish.",
    mood: "Cheerful",
  },
  {
    id: "watercolor-motion",
    name: "Watercolor Motion",
    category: "Elegant Christmas",
    tagline: "A moving watercolor cover that opens onto your wish.",
    mood: "Gentle",
  },
  {
    id: "bow-tree",
    name: "Bow Tree",
    category: "Minimal Christmas",
    tagline: "A tree drawn from little red bows.",
    mood: "Quiet",
  },
];

export const classicOpenIds = ["warm-bench", "gingerbread-gift", "woodland", "bow-tree", "watercolor-motion"];

export const designIds = templates.map((template) => template.id);

export function getTemplate(id: string) {
  return templates.find((template) => template.id === id);
}

export const sampleWishes = [
  "May your Christmas be unhurried, bright, and full of the people who feel like home.",
  "Wishing you a table that stays full, a fire that stays lit, and a year that feels kinder.",
  "However far apart we are tonight, you are very much in this house.",
];
