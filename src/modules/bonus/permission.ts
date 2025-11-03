import { Status } from "@/generated/prisma";

export type Role = "preparer" | "checker" | "approver";
export type Action = "read" | "write" | "submit" | "approve" | "reject" | "worflow";

const statusPermissions: Record<Status, Record<Role, Action[]>> = {
  [Status.NOT_STARTED]: {
    preparer: ["read", "write"],
    checker: ["read"],
    approver: ["read"]
  },

  [Status.IN_DRAFT]: {
    preparer: ["read", "write", "submit", "worflow"],
    checker: ["read"],
    approver: ["read"]
  },

  [Status.PENDING_CHECKER]: {
    preparer: ["read"],
    checker: ["read", "approve", "reject", "write", "submit"],
    approver: ["read"]
  },

  [Status.REJECTED_BY_CHECKER]: {
    preparer: ["read", "write", "worflow", "submit"],
    checker: ["read"],
    approver: ["read"]
  },

  [Status.PENDING_APPROVER]: {
    preparer: ["read"],
    checker: ["read"],
    approver: ["read", "approve", "reject", "submit", "write"]
  },

  [Status.REJECTED_BY_APPROVER]: {
    preparer: ["read", "write", "submit", "worflow"],
    checker: ["read"],
    approver: ["read"]
  },

  [Status.APPROVED]: {
    preparer: ["read"],
    checker: ["read"],
    approver: ["read"]
  },
}

export interface PermissionContext {
  employeeId: string;
  documentOwnerId: string;
  checkerId: string | null;
  approverId: string;
  status: Status;
}

export function canPerform(role: Role, action: Action[], status: Status): boolean {
  const permissions = statusPermissions[status]?.[role] || [];
  return action.every(action => permissions.includes(action));
}

export function getUserRole(context: PermissionContext): Role | null {
  const { employeeId, documentOwnerId, checkerId, approverId } = context;

  if (employeeId === documentOwnerId) {
    return "preparer";
  }

  if (checkerId && employeeId === checkerId) {
    return "checker";
  }

  if (employeeId === approverId) {
    return "approver";
  }

  return null;
}

export function canPerformMany(
  role: Role,
  actions: Action[],
  status: Status
): Record<Action, boolean> {
  const permissions = statusPermissions[status]?.[role] || [];
  return actions.reduce(
    (acc, action) => {
      acc[action] = permissions.includes(action);
      return acc;
    },
    {} as Record<Action, boolean>
  );
}
