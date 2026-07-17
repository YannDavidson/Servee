export type MenuModifier = {
  id: string;
  name: string;
  priceCents: number;
};

export type MenuItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  priceCents: number;
  emoji: string;
  available: boolean;
  featured?: boolean;
  modifiers?: MenuModifier[];
};

export type RestaurantMenu = {
  restaurantSlug: string;
  restaurantName: string;
  tagline: string;
  currency: "USD";
  categories: string[];
  items: MenuItem[];
};

const casaPalma: RestaurantMenu = {
  restaurantSlug: "casa-palma",
  restaurantName: "Casa Palma",
  tagline: "Fresh Caribbean cooking, served with warmth.",
  currency: "USD",
  categories: ["Popular", "Starters", "Mains", "Drinks", "Desserts"],
  items: [
    {
      id: "island-citrus-salmon",
      category: "Mains",
      name: "Island Citrus Salmon",
      description: "Roasted salmon, citrus glaze, coconut rice and seasonal greens.",
      priceCents: 2800,
      emoji: "🐟",
      available: true,
      featured: true,
      modifiers: [
        { id: "extra-sauce", name: "Extra citrus glaze", priceCents: 150 },
        { id: "extra-salmon", name: "Add salmon portion", priceCents: 900 }
      ]
    },
    {
      id: "golden-plantain-bowl",
      category: "Mains",
      name: "Golden Plantain Bowl",
      description: "Sweet plantain, black beans, avocado, pickled onions and herb sauce.",
      priceCents: 1800,
      emoji: "🥑",
      available: true,
      featured: true,
      modifiers: [
        { id: "add-chicken", name: "Add grilled chicken", priceCents: 600 },
        { id: "add-shrimp", name: "Add citrus shrimp", priceCents: 800 }
      ]
    },
    {
      id: "conch-fritters",
      category: "Starters",
      name: "Conch Fritters",
      description: "Crisp conch fritters with lime aioli and island herbs.",
      priceCents: 1400,
      emoji: "🍤",
      available: true,
      featured: true,
      modifiers: [{ id: "extra-aioli", name: "Extra lime aioli", priceCents: 100 }]
    },
    {
      id: "hibiscus-spritz",
      category: "Drinks",
      name: "Hibiscus Spritz",
      description: "Hibiscus, citrus, sparkling water and fresh mint.",
      priceCents: 800,
      emoji: "🍹",
      available: true
    },
    {
      id: "coconut-tres-leches",
      category: "Desserts",
      name: "Coconut Tres Leches",
      description: "Soft coconut sponge, vanilla cream and toasted coconut.",
      priceCents: 1000,
      emoji: "🍰",
      available: true,
      featured: true
    },
    {
      id: "mango-cheesecake",
      category: "Desserts",
      name: "Mango Cheesecake",
      description: "Creamy mango cheesecake with a ginger biscuit crust.",
      priceCents: 1100,
      emoji: "🥭",
      available: false
    }
  ]
};

const menus: Record<string, RestaurantMenu> = {
  "casa-palma": casaPalma
};

export function getRestaurantMenu(slug: string): RestaurantMenu | null {
  return menus[slug] ?? null;
}
