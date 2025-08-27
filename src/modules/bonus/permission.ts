import { Status } from "@/generated/prisma";

export type Role = "preparer" | "checker" | "approver";
type Action = "read" | "write" | "submit" | "approve" | "reject" | "request_correction";

const statusPermissions: Record<Status, Record<Role, Action[]>> = {
  [Status.NOT_STARTED]: {
    preparer: ["read", "write"],
    checker: ["read"],
    approver: ["read"]
  },
  
  [Status.IN_DRAFT]: {
    preparer: ["read", "write", "submit"],
    checker: ["read"],
    approver: ["read"]
  },
  
  [Status.PENDING_CHECKER]: {
    preparer: ["read"],
    checker: ["read", "approve", "reject", "request_correction"],
    approver: ["read"]
  },
  
  [Status.REJECTED_BY_CHECKER]: {
    preparer: ["read", "write", "submit"],
    checker: ["read"],
    approver: ["read"]
  },
  
  [Status.PENDING_APPROVER]: {
    preparer: ["read"],
    checker: ["read"],
    approver: ["read", "approve", "reject", "request_correction"]
  },
  
  [Status.REJECTED_BY_APPROVER]: {
    preparer: ["read", "write", "submit"],
    checker: ["read"],
    approver: ["read"]
  },
  
  [Status.APPROVED]: {
    preparer: ["read"],
    checker: ["read"],
    approver: ["read"]
  },
  
  [Status.REVISION]: {
    preparer: ["read", "write", "submit"],
    checker: ["read"],
    approver: ["read"]
  }
}

export interface PermissionContext {
  currentEmployeeId: string;
  documentOwnerId: string; 
  checkerId?: string;
  approverId: string;
  status: Status;
}

export function canPerform(role: Role, action: Action[], status: Status ): boolean {
  const permissions = statusPermissions[status]?.[role] || [];
  return action.every(action => permissions.includes(action));
}

export function getUserRole(context: PermissionContext): Role | null {
  const { currentEmployeeId, documentOwnerId, checkerId, approverId } = context;
  
  if (currentEmployeeId === documentOwnerId) {
    return "preparer";
  }
  
  if (checkerId && currentEmployeeId === checkerId) {
    return "checker";
  }
  
  if (currentEmployeeId === approverId) {
    return "approver";
  }
  
  return null;
}