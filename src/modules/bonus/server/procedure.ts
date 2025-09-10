import path from "path";

import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { convertAmountToUnit } from "@/lib/utils";

import { readCSV } from "@/seeds/utils/csv";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { App, Status } from "@/generated/prisma";

import { getUserRole, PermissionContext } from "../permission";
import { kpiBonusCreateSchema } from "../schema";

interface ApprovalCSVProps {
  order: string;
  employeeId: string;
  employeeName: string;
  employeePositionLevel: string;
  checkerEMPID?: string;
  checkerName?: string;
  checkerPositionLevel?: string;
  approverEMPID: string;
  approverName: string;
  approverPositionLevel: string;
}

export const bonusProcedure = createTRPCRouter({
  getByYear: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await prisma.kpiForm.findFirst({
        where: {
          year: input.year,
          employeeId: ctx.user.employee.id,
        },
        include: {
          task: true,
        },
      });

      return res;
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await prisma.kpiForm.findUnique({
        where: {
          id: input.id
        },
        include: {
          task: {
            include: {
              preparer: true,
              checker: true,
              approver: true,
            }
          },
          kpis: true,
        },
      });

      if (!res) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const kpiWithComments = await prisma.comment.findMany({
        where: {
          connectId: {
            in: res.kpis.map((kpi) => kpi.id)
          }
        },
        include: {
          employee: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const commentsByKpiId = kpiWithComments.reduce((acc, comment) => {
        if (!acc[comment.connectId]) {
          acc[comment.connectId] = [];
        }
        acc[comment.connectId].push(comment);
        return acc;
      }, {} as Record<string, typeof kpiWithComments>);

      const kpisWithComments = res.kpis.map(kpi => ({
        ...kpi,
        comments: commentsByKpiId[kpi.id] || [],
      }));

      const permissionContext: PermissionContext = {
        currentEmployeeId: ctx.user.employee.id,
        documentOwnerId: res.task.preparedBy,
        checkerId: res.task.checkedBy || undefined,
        approverId: res.task.approvedBy,
        status: res.task.status,
      };

      return {
        data: {
          ...res,
          kpis: kpisWithComments,
        },
        permission: {
          ctx: permissionContext,
          role: getUserRole(permissionContext),
        },
      };
    }),
  getKpiById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const res = await prisma.kpi.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!res) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return res;
    }),
  createForm: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const approvalFile = path.join(process.cwd(), "src/data", "approval.csv");
      const approvalRecords = readCSV<ApprovalCSVProps>(approvalFile);

      const taregetApproval = approvalRecords.find((f) => f.employeeId === ctx.user.employee.id);

      if (!taregetApproval) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const task = await prisma.task.create({
        data: {
          type: App.BONUS,
          status: Status.IN_DRAFT,
          preparedBy: ctx.user.employee.id,
          approvedBy: taregetApproval.approverEMPID,
          ...(taregetApproval.checkerEMPID && {
            checkedBy: taregetApproval.checkerEMPID,
          }),
        },
      });

      const res = await prisma.kpiForm.create({
        data: {
          year: input.year,
          employeeId: ctx.user.employee.id,
          taskId: task.id,
        },
      });

      return res;
    }),
  duplicateKpi: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const kpi = await prisma.kpi.findUnique({
        select: {
          name: true,
          category: true,
          definition: true,
          weight: true,
          objective: true,
          type: true,
          strategy: true,
          target100: true,
          target90: true,
          target80: true,
          target70: true,
          kpiFormId: true,
        },
        where: {
          id: input.id,
        },
      });

      if (!kpi) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const res = await prisma.kpi.create({
        data: kpi
      });

      return res;
    }),
  createKpi: protectedProcedure
    .input(
      z.object({
        kpiFormId: z.string(),
        kpiBonusCreateSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { weight, ...otherFields } = input.kpiBonusCreateSchema;

      const res = await prisma.kpi.create({
        data: {
          ...otherFields,
          kpiFormId: input.kpiFormId,
          weight: convertAmountToUnit(Number(weight), 2),
        },
      });

      await prisma.kpiForm.update({
        where: {
          id: input.kpiFormId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return res;
    }),
  createBulkKpi: protectedProcedure
    .input(
      z.object({
        kpiFormId: z.string(),
        kpis: z.array(kpiBonusCreateSchema),
      })
    )
    .mutation(async ({ input }) => {
      const data = input.kpis.map((k) => {
        const { weight, ...otherFields } = k;
        return {
          ...otherFields,
          kpiFormId: input.kpiFormId,
          weight: convertAmountToUnit(Number(weight), 2),
        };
      });

      await prisma.kpi.createMany({
        data,
      });

      const res = await prisma.kpiForm.update({
        where: {
          id: input.kpiFormId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return res;
    }),
  updateKpi: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        kpiBonusCreateSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { weight, ...otherFields } = input.kpiBonusCreateSchema;

      const res = await prisma.kpi.update({
        where: {
          id: input.id,
        },
        data: {
          ...otherFields,
          weight: convertAmountToUnit(Number(weight), 2),
        }
      });

      return res;
    }),
  deleteKpi: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await prisma.kpi.delete({
        where: {
          id: input.id,
        },
      });

      return res;
    }),
  deleteBulk: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await prisma.kpi.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });

      return res;
    }),
  startEvaluation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // TODO: Validate weight

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
  confirm: protectedProcedure
    .input(
      z.object({
        approve: z.boolean(),
        comment: z.string().optional(),
        taskId: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await prisma.task.findUnique({
        where: {
          id: input.taskId,
        },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const permissionContext: PermissionContext = {
        currentEmployeeId: ctx.user.employee.id,
        documentOwnerId: task.preparedBy,
        checkerId: task.checkedBy || undefined,
        approverId: task.approvedBy,
        status: task.status,
      };

      const role = getUserRole(permissionContext);

      if (role === "checker") {
        if (input.approve) {
          await prisma.task.update({
            where: {
              id: input.taskId,
            },
            data: {
              status: Status.PENDING_APPROVER,
            },
          });
        } else {
          await prisma.task.update({
            where: {
              id: input.taskId,
            },
            data: {
              status: Status.REJECTED_BY_CHECKER,
            },
          });
        }
      } else if (role === "approver") {
        if (input.approve) {
          await prisma.task.update({
            where: {
              id: input.taskId,
            },
            data: {
              status: Status.APPROVED,
            },
          });
        } else {
          await prisma.task.update({
            where: {
              id: input.taskId,
            },
            data: {
              status: Status.REJECTED_BY_APPROVER,
            },
          });
        }
      }

      if (input.comment) {
        await prisma.comment.create({
          data: {
            content: input.comment,
            connectId: input.id,
            createdBy: ctx.user.employee.id,
          },
        });
      }

      return { success: true };
    })
});