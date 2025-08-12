import path from "path";

import { prisma } from "@/lib/prisma";

import { readCSV } from "@/seeds/utils/csv";

import { Division, Employee, Position } from "@/generated/prisma";
import { auth } from "@/lib/auth";

interface EmployeeCVSProps {
  order: number;
  id: string;
  fullName: string;
  position: string;
  division: string;
  level: string;
  rank: string;
  department: string;
  email?: string;
  password: string;
}

export const seedEmployees = async () => {
  console.log("👥 Seeding employees...");

  const file = path.join(process.cwd(), "src/data", "employee.csv");
  const records = readCSV<EmployeeCVSProps>(file, (value, context) => {
    if (context.column === "password") return value;
    if (["id", "order"].includes(String(context.column))) return Number(value);
    return value;
  });

  if (!records.length) {
    console.warn("⚠️ No employee records found");
    return [];
  }

  const employees: Employee[] = [];
  
  for (const record of records) {
    const employee = await prisma.employee.create({
      data: {
        id: String(record.id),
        fullName: record.fullName,
        position: record.position,
        division: record.division as Division,
        level: record.level as Position,
        rank: record.rank as Position,
        department: record.department,
        email: record.email,
      },
    });
    
    employees.push(employee);
  }

  console.log(`✅ Created ${employees.length} employees`);

  await Promise.all(
    records.map(async (employee) => {
      const userEmail = employee.email || "t@somboon.co.th";
      try {
        await auth.api.signUpEmail({
          body: {
            email: String(userEmail),
            password: String(employee.password),
            name: String(employee.fullName),
            username: String(employee.id),
          },
        });
      } catch (err) {
        console.error(`❌ Failed to create user for ${employee.fullName}:`, err);
      }
    })
  );

  return employees;
}