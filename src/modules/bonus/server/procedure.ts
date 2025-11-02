import path from "path";

import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { convertAmountFromUnit, convertAmountToUnit, exportExcel } from "@/lib/utils";

import { readCSV } from "@/seeds/utils/csv";

import { ApprovalCSVProps } from "@/types/approval";
import { App, Period, Project, Status } from "@/generated/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { columns } from "@/modules/bonus/constants";
import { getUserRole } from "@/modules/bonus/permission";
import { buildPermissionContext } from "@/modules/tasks/utils";
import { calculateAchievementScore, formatKpiExport } from "@/modules/bonus/util";
import {
  kpiBonusCreateSchema,
  kpiBonusEvaluationSchema,
} from "@/modules/bonus/schema";

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
          tasks: {
            orderBy: {
              preparedAt: "asc",
            },
          },
          kpis: true,
        },
      });

      return {
        id: kpiForm?.id,
        task: {
          inDraft: kpiForm?.tasks.find((f) => f.context === String(Period.IN_DRAFT)),
          evaluate: kpiForm?.tasks.find((f) => f.context === String(Period.EVALUATION)),
        },
        chartInfo: [
          {
            label: "Owner",
            value: convertAmountFromUnit(
              kpiForm?.kpis.reduce((acc, kpi) => {
                return acc + (((kpi.achievementOwner ?? 0) as number) / 100) * (kpi.weight ?? 0);
              }, 0) ?? 0,
              2),
          },
          {
            label: "Checker",
            value: convertAmountFromUnit(
              kpiForm?.kpis.reduce((acc, kpi) => {
                return acc + (((kpi.achievementChecker ?? 0) as number) / 100) * (kpi.weight ?? 0);
              }, 0) ?? 0,
              2),
          },
          {
            label: "Approver",
            value: convertAmountFromUnit(
              kpiForm?.kpis.reduce((acc, kpi) => {
                return acc + (((kpi.achievementApprover ?? 0) as number) / 100) * (kpi.weight ?? 0);
              }, 0) ?? 0,
              2),
          },
        ]
      };
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        period: z.enum(Period),
      }),
    )
    .query(async ({ ctx, input }) => {
      const task = await prisma.task.findUnique({
        where: {
          id: input.id,
        },
        include: {
          preparer: true,
          checker: true,
          approver: true,
          kpiForm: {
            include: {
              kpis: true,
            },
          },
        },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const kpiWithComments = await prisma.comment.findMany({
        where: {
          connectId: {
            in: task.kpiForm?.kpis.map((kpi) => kpi.id),
          },
        },
        include: {
          employee: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const commentsByKpiId = kpiWithComments.reduce(
        (acc, comment) => {
          if (!acc[comment.connectId]) {
            acc[comment.connectId] = [];
          }
          acc[comment.connectId].push(comment);
          return acc;
        },
        {} as Record<string, typeof kpiWithComments>,
      );

      const kpisWithComments = task.kpiForm?.kpis.map((kpi) => ({
        ...kpi,
        comments: commentsByKpiId[kpi.id] || [],
      }));

      const permission = buildPermissionContext(ctx.user.employee.id, task);

      return {
        data: {
          ...task,
          kpiForm: {
            ...task.kpiForm,
            kpis: kpisWithComments,
          },
        },
        permission: {
          ctx: permission,
          role: getUserRole(permission),
        },
      };
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

      const targetApproval = approvalRecords.find(
        (f) => f.employeeId === ctx.user.employee.id,
      );

      if (input.period === Period.EVALUATION_2ND) {
        const meritTask = await prisma.task.findFirst({
          where: {
            meritForm: {
              year: input.year,
              employeeId: ctx.user.employee.id,
            },
            context: Period.EVALUATION_1ST,
            type: App.MERIT,
          },
        });

        if (!meritTask || meritTask.status !== Status.APPROVED) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "You must finish merit evaluation and get approved first!",
          });
        }
      }

      if (!targetApproval) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      let kpiForm = await prisma.kpiForm.findFirst({
        where: {
          year: input.year,
          employeeId: ctx.user.employee.id,
        },
        include: {
          kpis: true,
        },
      });

      if (!kpiForm) {
        kpiForm = await prisma.kpiForm.create({
          data: {
            year: input.year,
            employeeId: ctx.user.employee.id,
          },
          include: {
            kpis: true,
          },
        });
      } else {
        await prisma.kpiForm.update({
          where: {
            id: kpiForm.id,
          },
          data: {
            period: Period.EVALUATION,
          },
        });
      }

      const task = await prisma.task.create({
        data: {
          type: App.BONUS,
          fileId: kpiForm.id,
          status: Status.IN_DRAFT,
          context: String(input.period),
          preparedBy: ctx.user.employee.id,
          approvedBy: targetApproval.approverEMPID,
          ...(targetApproval.checkerEMPID && {
            checkedBy: targetApproval.checkerEMPID,
          }),
        },
      });

      return {
        id: task.id,
      };
    }),
  createKpi: protectedProcedure
    .input(
      z.object({
        kpiFormId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await prisma.kpi.create({
        data: {
          kpiFormId: input.kpiFormId,
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

      return { success: true };
    }),
  createBulkKpi: protectedProcedure
    .input(
      z.object({
        kpiFormId: z.string(),
        kpis: z.array(kpiBonusCreateSchema),
      }),
    )
    .mutation(async ({ input }) => {
      const data = input.kpis.map((k) => {
        const { weight, ...otherFields } = k;
        return {
          ...otherFields,
          kpiFormId: input.kpiFormId,
          weight: convertAmountToUnit(Number(weight), 2),
          type: otherFields.type ? (otherFields.type as Project) : null,
        };
      });

      await prisma.kpi.createMany({
        data,
      });

      await prisma.kpiForm.update({
        where: {
          id: input.kpiFormId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return { success: true };
    }),
  updateBulkKpi: protectedProcedure
    .input(
      z.object({
        kpis: z.array(
          z.object({
            id: z.string(),
            kpiBonusCreateSchema,
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      // Use transaction to ensure all updates succeed or fail together
      const result = await prisma.$transaction(async (tx) => {
        const updatePromises = input.kpis.map(
          ({ id, kpiBonusCreateSchema }) => {
            const { weight, ...otherFields } = kpiBonusCreateSchema;

            return tx.kpi.update({
              where: { id },
              data: {
                ...otherFields,
                type: otherFields.type ? (otherFields.type as Project) : null,
                weight: convertAmountToUnit(Number(weight), 2),
              },
            });
          },
        );

        const updatedKpis = await Promise.all(updatePromises);

        // Update the kpiForm timestamp once after all KPIs are updated
        if (updatedKpis.length > 0) {
          await tx.kpiForm.update({
            where: {
              id: updatedKpis[0].kpiFormId,
            },
            data: {
              updatedAt: new Date(),
            },
          });
        }

        return updatedKpis;
      });

      return result;
    }),
  updateBulkKpiEvaluation: protectedProcedure
    .input(
      z.object({
        evaluations: z.array(kpiBonusEvaluationSchema.omit({ role: true })),
      }),
    )
    .mutation(async ({ input }) => {
      const updates = await Promise.all(
        input.evaluations.map(async ({ id, ...evaluation }) =>
          prisma.kpi.update({
            where: { id },
            data: {
              fileUrl: evaluation.fileUrl,
              actualOwner: evaluation.actualOwner
                ? evaluation.actualOwner
                : null,
              achievementOwner: evaluation.achievementOwner
                ? evaluation.achievementOwner
                : null,
              actualChecker: evaluation.actualChecker
                ? evaluation.actualChecker
                : null,
              achievementChecker: evaluation.achievementChecker
                ? evaluation.achievementChecker
                : null,
              actualApprover: evaluation.actualApprover
                ? evaluation.actualApprover
                : null,
              achievementApprover: evaluation.achievementApprover
                ? evaluation.achievementApprover
                : null,
            },
          }),
        ),
      );

      return updates;
    }),
  deleteBulkKpi: protectedProcedure
    .input(
      z.object({
        kpiFormId: z.string(),
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      await prisma.$transaction([
        prisma.comment.deleteMany({
          where: {
            connectId: {
              in: input.ids,
            },
          },
        }),
        prisma.kpi.deleteMany({
          where: {
            id: {
              in: input.ids,
            },
          },
        }),
        prisma.kpiForm.update({
          where: {
            id: input.kpiFormId,
          },
          data: {
            updatedAt: new Date(),
          },
        }),
      ]);

      return null;
    }),
  deleteKpiFile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const kpi = await prisma.kpi.update({
        where: {
          id: input.id,
        },
        data: {
          fileUrl: null,
        },
      });

      return kpi;
    }),
  export: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const kpiForm = await prisma.kpiForm.findUnique({
        where: {
          id: input.id,
        },
        include: {
          kpis: true,
          employee: true,
        },
      });

      if (!kpiForm) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const data = formatKpiExport(kpiForm);

      const file = exportExcel([
        {
          name: "Score Summary",
          data,
          columns,
        },
      ]);

      return {
        file,
        id: kpiForm.id,
      };
    }),
});
