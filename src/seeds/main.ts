import { cleanUpDatabase } from "@/seeds/clear-up";
import { seedApprovals } from "@/seeds/seed-approval";
import { seedEmployees } from "@/seeds/seed-employee";

const seed = async () => {
  await cleanUpDatabase();

  const employees = await seedEmployees();

  await seedApprovals(new Set(employees.map((e) => e.id)));
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