import { prisma } from "@/lib/prisma";

export const cleanUpDatabase = async () => {
  console.log("🗑️ Cleaning up existing data...");

  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.competency.deleteMany();
  await prisma.culture.deleteMany();
  
  console.log("✅ Cleanup completed");
};