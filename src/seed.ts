import { hash, Options } from "@node-rs/argon2";

import { prisma } from "@/lib/prisma";

const opts: Options = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
}

const seed = async () => {
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  const employees = await prisma.employee.createManyAndReturn({
    data: [
      {
        id: "08736",
        fullName: "นายวัชรธร กิตะพาณิชย์",
        position: "กรรมการผู้อำนวยการ",
        division: "SAT",
        level: "President",
        rank: "President",
        department: "สำนักกรรมการผู้อำนวยการ",
        email: "tester1@somboon.co.th",
      },
      {
        id: "04326",
        fullName: "นายวารสา สวนดี",
        position: "กรรมการผู้จัดการ กลุ่มบริษัท - SBM&ICP",
        division: "SAT",
        level: "MD",
        rank: "MD",
        department: "สำนักกรรมการผู้จัดการ",
        email: "tester2@somboon.co.th",
      },
      {
        id: "11092",
        fullName: "นายเอกนาวิน ทับทวี",
        position: "ผู้จัดการแผนกผลิต (Machining)",
        division: "SFT1",
        level: "MGR",
        rank: "MGR",
        department: "แผนกผลิต",
      },
    ],
  });

  for (const employee of employees) {
    const hashedPassword = await hash("12345678", opts)

    await prisma.user.create({
      data: {
        name: employee.fullName,
        email: employee.email,
        username: employee.id,
        emailVerified: true,
        accounts: {
          create: {
            providerId: "credential",
            accountId: employee.email || employee.id,
            password: hashedPassword,
          }
        }
      }
    });
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
