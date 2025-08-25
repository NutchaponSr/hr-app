import { cleanUpDatabase } from "@/seeds/clear-up";
import { seedApprovals } from "@/seeds/seed-approval";
import { seedEmployees } from "@/seeds/seed-employee";
import { seedCompetencies } from "@/seeds/seed-competency";

const seed = async () => {
  await cleanUpDatabase();

  const employees = await seedEmployees();

  await seedApprovals(new Set(employees.map((e) => e.id)));

  await seedCompetencies();
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