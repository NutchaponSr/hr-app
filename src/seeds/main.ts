import { seedCulture } from "@/seeds/seed-culture";
import { cleanUpDatabase } from "@/seeds/clear-up";
import { seedEmployees } from "@/seeds/seed-employee";
import { seedApprovals } from "@/seeds/seed-approval";
import { seedCompetencies } from "@/seeds/seed-competency";

const seed = async () => {
  // await cleanUpDatabase();

  // await seedEmployees();
  await seedApprovals();

  // await seedCompetencies();
  // await seedCulture();
}

(async () => {
  try {
    console.log("🌱 Starting database seeding...");
    await seed();
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
})();