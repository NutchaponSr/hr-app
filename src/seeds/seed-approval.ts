import path from "path";

import { prisma } from "@/lib/prisma";

import { App } from "@/generated/prisma";
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
    const approverId = record.approverEMPID?.trim();
    const checkerId = record.checkerEMPID?.trim();

    if (!empId || !existingEmployeeIds.has(empId)) {
      console.warn(`⚠️ Skipping approval for missing employeeId: ${empId}`);
      continue;
    }

    if (!approverId || !existingEmployeeIds.has(approverId)) {
      console.warn(`⚠️ Skipping approval for missing approverEMPID: ${approverId}`);
      continue;
    }

    if (checkerId && !existingEmployeeIds.has(checkerId)) {
      console.warn(`⚠️ Skipping approval for missing checkerEMPID: ${checkerId}`);
      continue;
    }

    await prisma.approval.create({
      data: {
        app: App.KPI,
        preparedBy: record.employeeId,
        checkedBy: record.checkerEMPID || null,
        approvedBy: record.approverEMPID,
      },
    });

    createdCount++;
  }

  console.log(`✅ Created ${createdCount} approval records`);
}