import { prisma } from "@/lib/prisma";

import { Status } from "@/generated/prisma";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const taskProcedure = createTRPCRouter({
  getMany: protectedProcedure
    .query(async ({ ctx }) => {
      const matchStatuses = [
        Status.PENDING_APPROVER, 
        Status.PENDING_CHECKER,
        Status.REJECTED_BY_CHECKER,
        Status.REJECTED_BY_APPROVER,
      ];

      const res = await prisma.kpiRecord.findMany({
        where: {
          AND: [
            {
              status: {
                in: matchStatuses,
              },
            },
            {
              OR: [
                {
                  status: Status.PENDING_CHECKER,
                  KpiEvaluations: {
                    some: {
                      approval: {
                        checkedBy: ctx.user.employee.id,
                      },
                    },
                  },
                },
                {
                  status: Status.REJECTED_BY_CHECKER,
                  KpiEvaluations: {
                    some: {
                      approval: {
                        preparedBy: ctx.user.employee.id,
                      },
                    },
                  },
                },
                {
                  status: Status.PENDING_APPROVER,
                  KpiEvaluations: {
                    some: {
                      approval: {
                        approvedBy: ctx.user.employee.id,
                      },
                    },
                  },
                },
                {
                  status: Status.REJECTED_BY_APPROVER,
                  KpiEvaluations: {
                    some: {
                      approval: {
                        preparedBy: ctx.user.employee.id,
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
        include: {
          KpiEvaluations: {
            orderBy: {
              period: "desc",
            },
          },
          employee: true,
        },
        orderBy: [
          { status: "asc" },
          { updatedAt: "desc" },
        ],
      });

      return res;
    })
});