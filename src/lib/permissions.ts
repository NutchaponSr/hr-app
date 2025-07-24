import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

import { UserRole } from "@/generated/prisma";

const statements = {
  ...defaultStatements,
  backend: ["access"],
  tasks: ["create", "read", "update", "delete", "update:own", "delete:own"], 
} as const;

export const ac = createAccessControl(statements);

export const roles = {
  [UserRole.USER]: ac.newRole({
    backend: [],
    tasks: ["create", "read", "update:own", "delete:own"],
  }),
  [UserRole.ADMIN]: ac.newRole({
    backend: ["access"],
    tasks: ["create", "read", "update", "delete", "update:own", "delete:own"],
    ...adminAc.statements,
  }),
};