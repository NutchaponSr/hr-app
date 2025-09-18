import path from "path";

import { prisma } from "@/lib/prisma";

import { readCSV } from "@/seeds/utils/csv";
import { ApprovalCSVProps } from "@/types/approval";

export const seedApprovals = async () => {
  const approvalFile = path.join(process.cwd(), "src/data", "approval.csv");
  const approvalRecords = readCSV<ApprovalCSVProps>(approvalFile);

  await prisma.approval.createMany({
    data: approvalRecords.map((a) => ({
      preparedBy: a.employeeId,
      approvedBy: a.approverEMPID,
      ...(a.checkerEMPID && {
        checkedBy: a.checkerEMPID,
      }),
    }))
  });
  
  console.log("✅ Seeded approval data");
}