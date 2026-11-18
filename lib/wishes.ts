export const MESSAGE_LIMIT = 240;

export const wishCategories = [
  "Heartfelt",
  "Romantic",
  "Family",
  "Friends",
  "Professional",
  "Religious",
  "Funny",
] as const;

export type WishCategory = (typeof wishCategories)[number];

export const wishes: { category: WishCategory; text: string }[] = [
  { category: "Heartfelt", text: "May this Christmas find you warm, held, and sure that you are loved." },
  { category: "Heartfelt", text: "I am grateful for you this year. May the next one be gentle." },
  { category: "Romantic", text: "Another Christmas with you is the gift I would choose again." },
  { category: "Romantic", text: "You are my favourite part of every December." },
  { category: "Family", text: "Whatever the table looks like this year, there is a place kept for you." },
  { category: "Family", text: "Home is louder and kinder when you are in it. Merry Christmas." },
  { category: "Friends", text: "Thank you for the year we shared. Save me a seat next Christmas." },
  { category: "Friends", text: "May your holidays be full of the people who text you back." },
  { category: "Professional", text: "Wishing you a peaceful Christmas and a new year with room to breathe." },
  { category: "Professional", text: "Thank you for your partnership this year. Enjoy a well-earned rest." },
  { category: "Religious", text: "May the light of Christmas find you, and stay with you into the new year." },
  { category: "Religious", text: "Peace on earth begins in the rooms we keep open. Merry Christmas." },
  { category: "Funny", text: "You made the nice list. The committee was divided, but I campaigned hard." },
  { category: "Funny", text: "My gift is this card, which is both thoughtful and suspiciously inexpensive." },
];

export const lightColours = [
  { label: "Ink", value: "#2a2118" },
  { label: "Berry", value: "#8d2c3b" },
  { label: "Pine", value: "#143028" },
  { label: "Gold", value: "#8a6a2f" },
];

export const darkColours = [
  { label: "Cream", value: "#f8f1df" },
  { label: "Gold", value: "#e7d3a1" },
  { label: "White", value: "#ffffff" },
];

const darkTemplates = new Set(["glass-ornament", "bethlehem-star", "midnight-gold"]);

export function coloursFor(templateId: string) {
  return darkTemplates.has(templateId) ? darkColours : lightColours;
}
