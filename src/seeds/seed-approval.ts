import path from "path";

import { prisma } from "@/lib/prisma";

import { readCSV } from "@/seeds/utils/csv";

interface ApprovalCSVProps {
  order: string;
  employeeId: string;
  employeeName: string;
  employeePositionLevel: string;
  checkerEMPID?: string;
  checkerName?: string;
  checkerPositionLevel?: string;
  approverEMPID: string;
  approverName: string;
  approverPositionLevel: string;
}

export const seedApprovals = async (existingEmployeeIds: Set<string>) => {
  console.log("🔄 Seeding approvals...");

  const approvalFile = path.join(process.cwd(), "src/data", "approval.csv");
  const approvalRecords = readCSV<ApprovalCSVProps>(approvalFile);

  if (!approvalRecords.length) {
    console.warn("⚠️ No approval records found");
    return;
  }

  let createdCount = 0;

  for (const record of approvalRecords) {
    const empId = record.employeeId?.trim();

    if (!empId || !existingEmployeeIds.has(empId)) {
      console.warn(`⚠️ Skipping approval for missing employeeId: ${empId}`);
      continue;
    }

    await prisma.approval.create({
      data: {
        app: "KPI",
        preparedBy: record.employeeId,
        checkedBy: record.checkerEMPID || null,
        approvedBy: record.approverEMPID,
        preparedAt: new Date(),
        checkedAt: record.checkerName ? new Date() : null,
        approvedAt: new Date(),
      },
    });

    createdCount++;
  }

  console.log(`✅ Created ${createdCount} approval records`);
}