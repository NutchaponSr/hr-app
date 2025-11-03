import { prisma } from "@/lib/prisma";

export const cleanUpDatabase = async () => {
  console.log("🗑️ Cleaning up existing data...");

  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.competency.deleteMany();
  await prisma.culture.deleteMany();

  await prisma.kpiForm.deleteMany();
  await prisma.meritForm.deleteMany();
  await prisma.comment.deleteMany();
  
  console.log("✅ Cleanup completed");
};