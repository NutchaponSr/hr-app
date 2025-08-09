import fs from "fs";
import path from "path";

import { parse } from "csv-parse/sync";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { Division, Employee, Position } from "@/generated/prisma"

interface EmployeeCVSProps {
  order: string;
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

// const POSITION_HIERARCHY: Position[] = [
//   Position.President,
//   Position.MD,
//   Position.VP,
//   Position.GM,
//   Position.AGM,
//   Position.MGR,
//   Position.SMGR,
//   Position.Chief,
//   Position.Foreman,
//   Position.Staff,
//   Position.Worker,
//   Position.Officer
// ] as const;

// const getPositionLevel = (position: Position) => {
//   return POSITION_HIERARCHY.indexOf(position);
// }

// const findChecker = (employee: Employee, employees: Employee[]) => {
//   const selfLevel = getPositionLevel(employee.rank);

//   const potentialCheckers = employees.filter((emp) => 
//     emp.department === employee.department && 
//     emp.id !== employee.id && 
//     getPositionLevel(emp.rank) === selfLevel - 1,
//   );

//   if (potentialCheckers.length > 0) {
//     return potentialCheckers[0].id;
//   }

//   return null;
// }

// const findApprover = (
//   self: Employee, 
//   employees: Employee[]
// ) => {
//   const departmentEmployees = employees.filter(emp => 
//     emp.department === self.department
//   );

//   departmentEmployees.sort((a, b) =>
//     getPositionLevel(a.rank) - getPositionLevel(b.rank)
//   );
  
//   return departmentEmployees[0].id;
// } 

const seed = async () => {
  console.log("🗑️ Cleaning up existing data...");

  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  
  console.log("✅ Cleanup completed");
  console.log("👥 Creating employees...");

  try {
    const cvsFithPath = path.join(process.cwd(), "src/data", "employee.csv");
    const fileContent = fs.readFileSync(cvsFithPath, "utf-8");

    const csvRecords: EmployeeCVSProps[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: (value, context) => {
        if (context.column === "password") {
          return value;
        }

        if (context.column === "id" || context.column === "order") {
          return Number(value);
        }
        return value;
      },
    });

    console.log(`📊 Found ${csvRecords.length} employee records in CSV`);

    if (csvRecords.length === 0) {
      console.log("⚠️ No employee records found in CSV file");
      return;
    }

    console.log("👥 Creating employees...");

    const employeeData = csvRecords.map((record) => ({
      id: record.id.toString(),
      fullName: record.fullName,
      position: record.position,
      division: record.division as Division,
      level: record.level as Position,
      rank: record.rank as Position,
      department: record.department,
      email: record.email,
    }));

    console.log("👥 Creating employees with approvals...");

    const employees: Employee[] = [];

    for (const record of employeeData) {
      const employee = await prisma.employee.create({
        data: record,
      });

      employees.push(employee);
    }

    console.log(`✅ Successfully created ${employees.length} employees`);
    // console.log("🔄 Creating approval records...");

    // for (const employee of employees) {
    //   const checkerId = findChecker(employee, employees);
    //   const approverId = findApprover(employee, employees);

    //   console.log({
    //     self: employee,
    //     checker: employees.find((f) => f.id === checkerId),
    //     approver: employees.find((f) => f.id === approverId),
    //   });

    //   await prisma.approve.create({
    //     data: {
    //       app: App.KIP,
    //       selfId: employee.id,
    //       checkerId,
    //       approverId,
    //     },
    //   });
    // }

    await Promise.all(csvRecords.map(async (employee) => {
      const userEmail = employee.email || "t@somboon.co.th";

      return await auth.api.signUpEmail({
        body: {
          email: userEmail.toString(),
          password: employee.password.toString(),
          name: employee.fullName.toString(),
          username: employee.id.toString(),
        },
      });
    }));
  } catch (error) {
    console.error("❌ Error reading or parsing CSV file:", error);
  }
}

(async () => {
  try {
    console.log("🌱 Starting database seeding...");
    await seed();
    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
})();
