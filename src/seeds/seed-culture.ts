import cultures from "@/modules/merit/json/culture.json";

import { prisma } from "@/lib/prisma";

export const seedCulture = async () => {
  await prisma.culture.createMany({
    data: cultures.map(culture => ({
      name: culture.cultureName,
      code: culture.cultureCode,
      description: culture.description,
      belief: culture.beliefs
    }))
  });

  console.log(`✅ Seeded ${cultures.length} cultures`);
}