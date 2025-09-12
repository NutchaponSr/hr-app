import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";

import { Status, Task } from "@/generated/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { getUserRole, PermissionContext } from "@/modules/bonus/permission";

function buildPermissionContext(currentEmployeeId: string, task: Task): PermissionContext {
  return {
    currentEmployeeId,
    documentOwnerId: task.preparedBy,
    checkerId: task.checkedBy || undefined,
    approverId: task.approvedBy,
    status: task.status,
  };
}

export const taskProcedure = createTRPCRouter({
  getMany: protectedProcedure
    .query(async ({ ctx }) => {
      const tasks = await prisma.task.findMany({
        where: {
          AND: [
            {
              status: {
                in: [
                  Status.PENDING_APPROVER,
                  Status.PENDING_CHECKER,
                  Status.REJECTED_BY_APPROVER,
                  Status.REJECTED_BY_CHECKER,
                ],
              },
            },
            {
              OR: [
                {
                  status: Status.PENDING_CHECKER,
                  checkedBy: ctx.user.employee.id,
                },
                {
                  status: Status.REJECTED_BY_CHECKER,
                  preparedBy: ctx.user.employee.id,
                },
                {
                  status: Status.PENDING_APPROVER,
                  approvedBy: ctx.user.employee.id,
                },
                {
                  status: Status.REJECTED_BY_APPROVER,
                  preparedBy: ctx.user.employee.id,
                },
              ],
            },
          ],
        },
        include: {
          preparer: true,
          kpiForms: true,
          meritForms: true,
        },
        orderBy: {
          updatedAt: "desc",
        }
      });

      return {
        data: tasks.map((task) => ({
          task: {
            id: task.id,
            type: task.type,
            status: task.status,
            updatedAt: task.updatedAt,
          },
          info: {
            id: task.kpiForms[0]?.id || task.meritForms[0]?.id || "",
            assignedBy: task.preparer.fullName,
            year: task.kpiForms[0]?.year || task.meritForms[0]?.year || 0,
          },
        })),
      };
    }),
  startWorkflow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const task = await prisma.task.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const res = await prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          status: task.checkedBy ? Status.PENDING_CHECKER : Status.PENDING_APPROVER,
        },
      });

      return res;
    }),
  confirmation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        confirm: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await prisma.task.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const permissionContext = buildPermissionContext(ctx.user.employee.id, task);
      const role = getUserRole(permissionContext);

      if (role === "checker") {
        if (input.confirm) {
          await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.PENDING_APPROVER,
            },
          });
        } else {
          await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.REJECTED_BY_CHECKER,
            },
          });
        }
      } else if (role === "approver") {
        if (input.confirm) {
          await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.APPROVED,
            },
          });
        } else {
          await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.REJECTED_BY_APPROVER,
            },
          });
        }
      }
      
      return { success: true };
    })
});