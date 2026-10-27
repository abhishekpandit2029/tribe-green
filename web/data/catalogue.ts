export const CATEGORIES = [
  "Drinkware",
  "Apparel",
  "Work Essentials",
  "Wellness",
] as const;
export const OCCASIONS = [
  "Employee Onboarding",
  "Corporate Diwali Gifting",
  "New Year Gifts",
  "Client and Vendor Gifting",
  "Events and Trade Shows",
  "Employee Recognition",
] as const;
export const CUSTOMISATIONS = [
  "Logo printing",
  "Laser engraving",
  "Name personalisation",
] as const;
export const BUDGETS = [
  "Under ₹500",
  "₹500 to ₹1,500",
  "₹1,500 to ₹3,000",
  "Above ₹3,000",
] as const;
export type Category = (typeof CATEGORIES)[number];
export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  priceMin: number;
  priceMax: number;
  image: string;
  occasions: string[];
  customisations: string[];
  featured?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "copper-bottle",
    name: "Copper Calm Bottle",
    category: "Drinkware",
    description:
      "A double-wall copper finish bottle that keeps hydration close at hand, from desk to commute.",
    priceMin: 850,
    priceMax: 1250,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85",
    occasions: [
      "Employee Onboarding",
      "Corporate Diwali Gifting",
      "Client and Vendor Gifting",
      "Employee Recognition",
    ],
    customisations: [...CUSTOMISATIONS],
    featured: true,
  },
  {
    id: "ceramic-mug",
    name: "Everyday Ceramic Mug",
    category: "Drinkware",
    description:
      "A beautifully balanced stoneware mug for the first coffee and every good idea after.",
    priceMin: 450,
    priceMax: 780,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=85",
    occasions: [
      "Employee Onboarding",
      "New Year Gifts",
      "Events and Trade Shows",
    ],
    customisations: [...CUSTOMISATIONS],
  },
  {
    id: "organic-tee",
    name: "Organic Cotton Tee",
    category: "Apparel",
    description:
      "Soft, responsibly made cotton with a clean fit your team will reach for again.",
    priceMin: 700,
    priceMax: 1300,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",
    occasions: [
      "Employee Onboarding",
      "Events and Trade Shows",
      "Employee Recognition",
    ],
    customisations: ["Logo printing", "Name personalisation"],
  },
  {
    id: "canvas-tote",
    name: "Market Day Canvas Tote",
    category: "Apparel",
    description:
      "A sturdy everyday canvas carryall with room for the essentials and then some.",
    priceMin: 380,
    priceMax: 650,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
    occasions: [
      "Corporate Diwali Gifting",
      "New Year Gifts",
      "Events and Trade Shows",
    ],
    customisations: ["Logo printing", "Name personalisation"],
    featured: true,
  },
  {
    id: "desk-kit",
    name: "Thoughtful Desk Kit",
    category: "Work Essentials",
    description:
      "A considered set of useful desk favourites to make a new workspace feel like theirs.",
    priceMin: 1650,
    priceMax: 2600,
    image:
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=85",
    occasions: [
      "Employee Onboarding",
      "New Year Gifts",
      "Employee Recognition",
    ],
    customisations: [...CUSTOMISATIONS],
    featured: true,
  },
  {
    id: "journal-set",
    name: "Ideas in Motion Set",
    category: "Work Essentials",
    description:
      "A tactile hardcover journal and pen set for notes, plans and bright new beginnings.",
    priceMin: 560,
    priceMax: 1100,
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1000&q=85",
    occasions: [
      "Employee Onboarding",
      "Client and Vendor Gifting",
      "Events and Trade Shows",
    ],
    customisations: [...CUSTOMISATIONS],
  },
  {
    id: "wellness-box",
    name: "Slow Morning Wellness Box",
    category: "Wellness",
    description:
      "A restorative ritual box of calming comforts, thoughtfully packed for a little pause.",
    priceMin: 1850,
    priceMax: 2900,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=85",
    occasions: [
      "Corporate Diwali Gifting",
      "New Year Gifts",
      "Employee Recognition",
    ],
    customisations: ["Logo printing", "Name personalisation"],
    featured: true,
  },
  {
    id: "travel-candle",
    name: "Quiet Hours Candle Duo",
    category: "Wellness",
    description:
      "Two warm, softly scented candles for winding down after a full day.",
    priceMin: 1250,
    priceMax: 1950,
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85",
    occasions: [
      "Corporate Diwali Gifting",
      "New Year Gifts",
      "Client and Vendor Gifting",
    ],
    customisations: ["Logo printing", "Laser engraving"],
  },
];

export type Enquiry = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  occasion: string;
  units: number;
  budget: string;
  deliveryDate: string;
  products: string[];
  customisations: string[];
  message: string;
  source: "Website" | "Mobile app";
  status: "New" | "Contacted" | "Converted" | "Lost";
  createdAt: string;
};
