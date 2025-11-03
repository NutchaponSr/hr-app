import { Task } from "@/generated/prisma";

import { PermissionContext } from "@/modules/bonus/permission";

export function buildPermissionContext(employeeId: string, task: Task): PermissionContext {
  return {
    employeeId,
    documentOwnerId: task.preparedBy,
    checkerId: task.checkedBy,
    approverId: task.approvedBy,
    status: task.status,
  };
}