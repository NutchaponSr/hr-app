import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const seed = async () => {
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  const employees = await prisma.employee.createManyAndReturn({
    data: [
      {
        id: "08736",
        fullName: "Tester1",
        position: "กรรมการผู้อำนวยการ",
        division: "SAT",
        level: "President",
        rank: "President",
        department: "สำนักกรรมการผู้อำนวยการ",
        email: "tester1@somboon.co.th",
      },
      {
        id: "04326",
        fullName: "Tester2",
        position: "กรรมการผู้จัดการ กลุ่มบริษัท - SBM&ICP",
        division: "SAT",
        level: "MD",
        rank: "MD",
        department: "สำนักกรรมการผู้จัดการ",
        email: "tester2@somboon.co.th",
      },
      {
        id: "11092",
        fullName: "Tester3",
        position: "ผู้จัดการแผนกผลิต (Machining)",
        division: "SFT1",
        level: "MGR",
        rank: "MGR",
        department: "แผนกผลิต",
      },
    ],
  });

  for (const employee of employees) {
    if (employee.email) {
      await auth.api.signUpEmail({
        body: {
          name: employee.fullName,
          email: employee.email,
          password: "12345678",
          username: employee.id,
        },
      });
    } else {
      await auth.api.signUpEmail({
        body: {
          name: employee.fullName,
          email: "t@somboon.co.th",
          username: employee.id,
          password: "12345678",
        },
      });
    }
  }
}

(async () => {
  try {
    await seed();
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding...", error);
    process.exit(1);
  }
})();
