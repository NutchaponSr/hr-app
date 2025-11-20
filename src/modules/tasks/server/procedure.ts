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

export const taskProcedure = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const tasks = await prisma.task.findMany({
      where: {
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
      fileId: task.fileId,
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

      const targetApproval = approvalRecords
        .filter(
          (f) =>
            f.checkerEMPID === ctx.user.employee.id ||
            f.approverEMPID === ctx.user.employee.id,
        )
        .map((record) => record.employeeId);

      const [kpiForms, meritForms, employees] = await Promise.all([
        prisma.kpiForm.findMany({
          where: {
            AND: [
              {
                employeeId: {
                  in: targetApproval,
                },
              },
              {
                year: {
                  gte: input.year - 1,
                  lte: input.year,
                },
              },
            ],
          },
          include: {
            tasks: {
              orderBy: {
                preparedAt: "asc",
              },
            },
            employee: true,
          },
        }),
        prisma.meritForm.findMany({
          where: {
            AND: [
              {
                employeeId: {
                  in: targetApproval,
                },
              },
              {
                year: {
                  gte: input.year - 1,
                  lte: input.year,
                },
              },
            ],
          },
          include: {
            tasks: {
              orderBy: {
                preparedAt: "asc",
              },
            },
            employee: true,
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

      const kpiFormsByEmployee = kpiForms.reduce<
        Record<string, (typeof kpiForms)[0][]>
      >((acc, form) => {
        acc[form.employeeId] ??= [];
        acc[form.employeeId].push(form);
        return acc;
      }, {});

      const meritFormsByEmployee = meritForms.reduce<
        Record<string, (typeof meritForms)[0][]>
      >((acc, form) => {
        acc[form.employeeId] ??= [];
        acc[form.employeeId].push(form);
        return acc;
      }, {});

      // หา employee ที่ไม่มี form ใดๆ
      const employeesWithNoForm = employees.filter(
        (emp) =>
          !kpiFormsByEmployee[emp.id]?.length &&
          !meritFormsByEmployee[emp.id]?.length,
      );
      
      
      const bonusPending = kpiForms
        .flatMap((k) => k.tasks)
        .filter((t) => t.status === Status.PENDING_CHECKER || t.status === Status.PENDING_APPROVER)
        .length;

      const meritPending = meritForms
        .flatMap((m) => m.tasks)
        .filter((t) => t.status === Status.PENDING_CHECKER || t.status === Status.PENDING_APPROVER)
        .length;

      return {
        info: {
          total: employees.length,
          done: {
            bonus: kpiForms.filter((f) => f.period === Period.EVALUATION).length,
            merit: meritForms.filter((f) => f.period === Period.EVALUATION).length,
          },
          notDone: {
            bonus:
              kpiForms.filter((f) => f.period !== Period.EVALUATION).length +
              employeesWithNoForm.length,
            merit:
              meritForms.filter((f) => f.period !== Period.EVALUATION).length +
              employeesWithNoForm.length,
          },
          pending: bonusPending + meritPending,
        },
        employees: employees.map((employee) => {
          const employeeKpiForms = kpiFormsByEmployee[employee.id] || [];
          const employeeMeritForms = meritFormsByEmployee[employee.id] || [];
  
          // หา form ที่ตรงกับปีที่ต้องการ (prioritize current year)
          const kpiForm =
            employeeKpiForms.find((f) => f.year === input.year) ||
            employeeKpiForms[0] ||
            null;
          const meritForm =
            employeeMeritForms.find((f) => f.year === input.year) ||
            employeeMeritForms[0] ||
            null;
  
          // รวม tasks จาก form ทั้งหมด
          const allKpiTasks = employeeKpiForms.flatMap((f) => f.tasks);
          const allMeritTasks = employeeMeritForms.flatMap((f) => f.tasks);
  
          return {
            employee,
            form: {
              bonus: kpiForm
                ? {
                    ...kpiForm,
                    tasks: allKpiTasks,
                  }
                : null,
              merit: meritForm
                ? {
                    ...meritForm,
                    tasks: allMeritTasks,
                  }
                : null,
            },
          };
        }),
      };
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
          preparer: true,
        },
      });

      return {
        id: res.id,
        emails: [res.preparer.email, res.checker?.email, res.approver?.email],
      };
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
