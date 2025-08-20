import { prisma } from "@/lib/prisma";

export const cleanUpDatabase = async () => {
  console.log("🗑️ Cleaning up existing data...");

  await prisma.approval.deleteMany();
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.competency.deleteMany();
  
  console.log("✅ Cleanup completed");
};