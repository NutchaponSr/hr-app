import { prisma } from "@/lib/prisma";

import { Status } from "@/generated/prisma";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

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
            id: task.kpiForms[0].id,
            assignedBy: task.preparer.fullName, 
            year: task.kpiForms[0].year
          },
        })),
      };
    })
});