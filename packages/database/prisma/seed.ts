import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.restaurant.upsert({
    where: { slug: "casa-palma" },
    update: {},
    create: {
      name: "Casa Palma",
      slug: "casa-palma",
      locations: {
        create: {
          name: "San Juan",
          tables: { create: { label: "14", qrToken: "servee-demo-casa-palma-table-14" } },
          menuItems: {
            create: [
              { name: "Island Citrus Salmon", description: "Roasted salmon, citrus glaze, coconut rice and seasonal greens.", priceCents: 2800, category: "Mains", isAvailable: true },
              { name: "Golden Plantain Bowl", description: "Sweet plantain, black beans, avocado, pickled onions and herb sauce.", priceCents: 1800, category: "Mains", isAvailable: true },
              { name: "Coconut Tres Leches", description: "Soft coconut sponge, vanilla cream and toasted coconut.", priceCents: 1000, category: "Desserts", isAvailable: true },
              { name: "Passionfruit Spritz", description: "Passionfruit, lime, sparkling water and mint.", priceCents: 800, category: "Drinks", isAvailable: true }
            ]
          }
        }
      }
    }
  });
}

main()
  .finally(async () => prisma.$disconnect());
