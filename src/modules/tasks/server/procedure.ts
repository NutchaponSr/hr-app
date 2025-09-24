import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";

import { App, Status, Task } from "@/generated/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { getUserRole, PermissionContext } from "@/modules/bonus/permission";

function buildPermissionContext(currentEmployeeId: string, task: Task): PermissionContext {
  return {
    currentEmployeeId,
    documentOwnerId: task.preparedBy,
    checkerId: task.checkedBy,
    approverId: task.approvedBy,
    status: task.status,
  };
}

export const taskProcedure = createTRPCRouter({
  getMany: protectedProcedure
    .query(async ({ ctx }) => {
      const tasks = await prisma.task.findMany({
        where: {
          OR: [
            {
              status: Status.IN_DRAFT,
              preparedBy: ctx.user.employee.id,
            },
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
        include: {
          preparer: true,
          kpiForm: true,
          meritForm: true,
        },
        orderBy: {
          updatedAt: "desc",
        }
      });

      
      return tasks.map((task) => ({
        taskId: task.id,
        app: task.type,
        status: task.status,
        fileId: task.id,
        year: task.kpiForm?.year || task.meritForm?.year,
        owner: task.preparer,
        updatedAt: task.updatedAt,
        period: task.kpiForm?.period || task.meritForm?.period,
      }));
    }),
  getManyByYear: protectedProcedure
    .input(
      z.object({
        year: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const tasks = await prisma.task.findMany({
        where: {
          preparedAt: {
            gte: new Date(input.year, 0, 1),
            lte: new Date(input.year, 11, 31, 23, 59, 59),
          },
          OR: [
            {
              checkedBy: ctx.user.employee.id,
            },
            {
              approvedBy: ctx.user.employee.id,
            },
          ],
        },
        include: {
          preparer: true,
          kpiForm: true,
          meritForm: true,
        },
      });

      return tasks.map((task) => ({
        updatedAt: task.kpiForm?.updatedAt || task.meritForm?.updatedAt,
        status: task.status,
        app: task.type,
        owner: task.preparer,
        period: task.kpiForm?.period || task.meritForm?.period,
        taskId: task.id,
      }));
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