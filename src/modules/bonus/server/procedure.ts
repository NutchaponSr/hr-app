import path from "path";

import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { convertAmountToUnit } from "@/lib/utils";

import { readCSV } from "@/seeds/utils/csv";

import { ApprovalCSVProps } from "@/types/approval";
import { App, Period, Status } from "@/generated/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { kpiBonusCreateSchema } from "../schema";
import { getUserRole, PermissionContext } from "../permission";

export const bonusProcedure = createTRPCRouter({
  getByYear: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const kpiForm = await prisma.kpiForm.findFirst({
        where: {
          year: input.year,
          employeeId: ctx.user.employee.id,
        },
        include: {
          forms: {
            include: {
              task: true,
            },
          },
        },
      });

      const getFormByPeriod = (period: Period) => {
        return kpiForm?.forms.find((form) => form.period === period);
      }

      return {
        ...kpiForm,
        kpiRecord: {
          inDraft: getFormByPeriod(Period.IN_DRAFT),
          evaluation1st: getFormByPeriod(Period.EVALUATION_1ST),
          evaluation2nd: getFormByPeriod(Period.EVALUATION_2ND),
        },
      };
    }),
  getByFormId: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const form = await prisma.form.findUnique({
        where: {
          id: input.formId,
        },
        include: {
          kpiForm: {
            include: {
              kpis: true,
            },
          },
          task: {
            include: {
              preparer: true,
              checker: true,
              approver: true,
            },
          },
        },
      });

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const kpiWithComments = await prisma.comment.findMany({
        where: {
          connectId: {
            in: form.kpiForm?.kpis.map((kpi) => kpi.id)
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

      const kpisWithComments = form.kpiForm?.kpis.map(kpi => ({
        ...kpi,
        comments: commentsByKpiId[kpi.id] || [],
      }));

      const permissionContext: PermissionContext = {
        currentEmployeeId: ctx.user.employee.id,
        documentOwnerId: form.task.preparedBy,
        checkerId: form.task.checkedBy || undefined,
        approverId: form.task.approvedBy,
        status: form.task.status,
      };

      return {
        data: {
          ...form,
          kpiForm: {
            ...form.kpiForm,
            kpis: kpisWithComments,
          },
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
        period: z.enum(Period),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const approvalFile = path.join(process.cwd(), "src/data", "approval.csv");
      const approvalRecords = readCSV<ApprovalCSVProps>(approvalFile);

      const targetApproval = approvalRecords.find((f) => f.employeeId === ctx.user.employee.id);

      if (!targetApproval) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const form = await prisma.form.create({
        data: {
          period: input.period,
          task: {
            create: {
              type: App.BONUS,
              status: Status.IN_DRAFT,
              preparedBy: ctx.user.employee.id,
              approvedBy: targetApproval.approverEMPID,
              ...(targetApproval.checkerEMPID && {
                checkedBy: targetApproval.checkerEMPID,
              }),
            },
          },
          kpiForm: {
            create: {
              year: input.year,
              employeeId: ctx.user.employee.id,
            },
          },
        },
      });

      return form;
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
          kpiForm: {
            update: {
              updatedAt: new Date(),
            },
          },
        },
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
});