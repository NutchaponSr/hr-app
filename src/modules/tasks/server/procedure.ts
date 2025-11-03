import path from "path";

import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";

import { Period, Status } from "@/generated/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { getUserRole } from "@/modules/bonus/permission";
import { buildPermissionContext } from "../utils";
import { readCSV } from "@/seeds/utils/csv";
import { ApprovalCSVProps } from "@/types/approval";

function getAppStatus(
  form: { period: Period } | null,
): string {
  if (!form) {
    return Status.NOT_STARTED as string;
  }

  if (form.period === Period.IN_DRAFT) {
    return Period.IN_DRAFT as string;
  }

  if (form.period === Period.EVALUATION_1ST) {
    return Period.EVALUATION_1ST as string;
  }

  if (form.period === Period.EVALUATION_2ND) {
    return Period.EVALUATION_2ND as string;
  }

  return "DONE";
}

export const taskProcedure = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
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
      },
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
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const approvalFile = path.join(process.cwd(), "src/data", "approval.csv");
      const approvalRecords = readCSV<ApprovalCSVProps>(approvalFile);

      const targetApproval = approvalRecords.filter((f) =>
        f.checkerEMPID === ctx.user.employee.id ||
        f.approverEMPID === ctx.user.employee.id,
      ).map((record) => record.employeeId);

      const [tasks, employees] = await Promise.all([
        prisma.task.findMany({
          where: {
            AND: [
              {
                preparedBy: {
                  in: targetApproval,
                },
              },
              {
                OR: [
                  {
                    kpiForm: {
                      year: {
                        gte: input.year - 1,
                        lte: input.year,
                      },
                    },
                  },
                  {
                    meritForm: {
                      year: {
                        gte: input.year - 1,
                        lte: input.year,
                      },
                    },
                  },
                ],
              },
            ],
          },
          include: {
            preparer: true,
            kpiForm: true,
            meritForm: true,
          },
        }),
        prisma.employee.findMany({
          where: {
            id: {
              in: targetApproval,
            },
          },
        }),
      ]);

      const tasksByEmployee = tasks.reduce<Record<string, typeof tasks>>(
        (acc, task) => {
          const empId = task.preparer.id;
          acc[empId] ??= [];
          acc[empId].push(task);
          return acc;
        },
        {},
      );

      return employees.map((employee) => {
        const employeeTasks = tasksByEmployee[employee.id] || [];
        const kpiForm = employeeTasks.find((task) => task.kpiForm !== null)?.kpiForm || null;
        const meritForm = employeeTasks.find((task) => task.meritForm !== null)?.meritForm || null;

        return {
          employee,
          apps: {
            bonus: getAppStatus(kpiForm),
            merit: getAppStatus(meritForm),
          },
        };
      });
    }),
  startWorkflow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
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
          status: task.checkedBy
            ? Status.PENDING_CHECKER
            : Status.PENDING_APPROVER,
        },
        include: {
          checker: true,
          approver: true,
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

      const permissionContext = buildPermissionContext(
        ctx.user.employee.id,
        task,
      );
      const role = getUserRole(permissionContext);

      let res = null;

      if (role === "checker") {
        if (input.confirm) {
          res = await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.PENDING_APPROVER,
              checkedAt: new Date(),
            },
            include: {
              checker: true,
              approver: true,
              preparer: true,
            },
          });
        } else {
          res = await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.REJECTED_BY_CHECKER,
            },
            include: {
              checker: true,
              approver: true,
              preparer: true,
            },
          });
        }
      } else if (role === "approver") {
        if (input.confirm) {
          res = await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.APPROVED,
              approvedAt: new Date(),
            },
            include: {
              checker: true,
              approver: true,
              preparer: true,
            },
          });
        } else {
          res = await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.REJECTED_BY_APPROVER,
            },
            include: {
              preparer: true,
              checker: true,
              approver: true,
            },
          });
        }
      }

      if (!res) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        id: res.id,
        emails: [res.preparer.email, res.checker?.email, res.approver?.email],
        isApproved: res.status === Status.APPROVED,
      };
    }),
});
