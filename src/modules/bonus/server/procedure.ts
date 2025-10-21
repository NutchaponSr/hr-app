import path from "path";

import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { convertAmountFromUnit, convertAmountToUnit, exportExcel } from "@/lib/utils";

import { readCSV } from "@/seeds/utils/csv";

import { ApprovalCSVProps } from "@/types/approval";
import { App, Period, Project, Status } from "@/generated/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { kpiBonusCreateSchema, kpiBonusEvaluationSchema } from "@/modules/bonus/schema";
import { getUserRole, PermissionContext } from "@/modules/bonus/permission";
import { columns } from "@/modules/bonus/constants";
import { formatKpiExport } from "@/modules/bonus/util";

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
          kpis: {
            include: {
              kpiEvaluations: true,
            },
          },
        },
      });

      return {
        id: kpiForm?.id,
        task: {
          inDraft: kpiForm?.tasks[0],
          evaluation1st: kpiForm?.tasks[1],
          evaluation2nd: kpiForm?.tasks[2],
        },
        chartInfo: [
          {
            period: "Evaluation 1st",
            owner: convertAmountFromUnit(
              (kpiForm?.kpis ?? []).reduce((acc, kpi) => {
                const evaluation = kpi.kpiEvaluations.find((f) => f.period === Period.EVALUATION_1ST);
                return acc + (((evaluation?.achievementOwner ?? 0) / 100) * kpi.weight);
              }, 0),
              2
            ),
            checker: convertAmountFromUnit(
              (kpiForm?.kpis ?? []).reduce((acc, kpi) => {
                const evaluation = kpi.kpiEvaluations.find((f) => f.period === Period.EVALUATION_1ST);
                return acc + (((evaluation?.achievementChecker ?? 0) / 100) * kpi.weight);
              }, 0),
              2
            ),
            approver: convertAmountFromUnit(
              (kpiForm?.kpis ?? []).reduce((acc, kpi) => {
                const evaluation = kpi.kpiEvaluations.find((f) => f.period === Period.EVALUATION_1ST);
                return acc + (((evaluation?.achievementApprover ?? 0) / 100) * kpi.weight);
              }, 0),
              2
            ),
          },
          {
            period: "Evaluation 2nd",
            owner: convertAmountFromUnit(
              (kpiForm?.kpis ?? []).reduce((acc, kpi) => {
                const evaluation = kpi.kpiEvaluations.find((f) => f.period === Period.EVALUATION_2ND);
                return acc + (((evaluation?.achievementOwner ?? 0) / 100) * kpi.weight);
              }, 0),
              2
            ),
            checker: convertAmountFromUnit(
              (kpiForm?.kpis ?? []).reduce((acc, kpi) => {
                const evaluation = kpi.kpiEvaluations.find((f) => f.period === Period.EVALUATION_2ND);
                return acc + (((evaluation?.achievementChecker ?? 0) / 100) * kpi.weight);
              }, 0),
              2
            ),
            approver: convertAmountFromUnit(
              (kpiForm?.kpis ?? []).reduce((acc, kpi) => {
                const evaluation = kpi.kpiEvaluations.find((f) => f.period === Period.EVALUATION_2ND);
                return acc + (((evaluation?.achievementApprover ?? 0) / 100) * kpi.weight);
              }, 0),
              2
            ),
          },
        ],
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
              kpis: {
                include: {
                  kpiEvaluations: {
                    where: {
                      period: input.period,
                    },
                  },
                },
              },
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
            in: task.kpiForm?.kpis.map((kpi) => kpi.id)
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

      const kpisWithComments = task.kpiForm?.kpis.map(kpi => ({
        ...kpi,
        comments: commentsByKpiId[kpi.id] || [],
      }));

      const permissionContext: PermissionContext = {
        currentEmployeeId: ctx.user.employee.id,
        documentOwnerId: task.preparedBy,
        checkerId: task.checkedBy,
        approverId: task.approvedBy,
        status: task.status,
      };

      return {
        data: {
          ...task,
          kpiForm: {
            ...task.kpiForm,
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
        const kpiFormUpdated = await prisma.kpiForm.update({
          where: {
            id: kpiForm.id,
          },
          data: {
            period: input.period,
          },
        });

        if (kpiFormUpdated && kpiFormUpdated.period !== Period.IN_DRAFT) {
          await prisma.kpiEvaluation.createMany({
            data: kpiForm.kpis.map((kpi) => ({
              kpiId: kpi.id,
              period: kpiFormUpdated.period,
            })),
          });
        }
      }

      const task = await prisma.task.create({
        data: {
          type: App.BONUS,
          fileId: kpiForm.id,
          status: Status.IN_DRAFT,
          preparedBy: ctx.user.employee.id,
          approvedBy: targetApproval.approverEMPID,
          ...(targetApproval.checkerEMPID && {
            checkedBy: targetApproval.checkerEMPID,
          }),
        },
      });

      return task;
    }),
  createKpi: protectedProcedure
    .input(
      z.object({
        kpiFormId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await prisma.kpi.create({
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
          type: otherFields.type ? otherFields.type as Project : null,
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
  updateBulkKpi: protectedProcedure
    .input(
      z.object({
        kpis: z.array(
          z.object({
            id: z.string(),
            kpiBonusCreateSchema,
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // Use transaction to ensure all updates succeed or fail together
      const result = await prisma.$transaction(async (tx) => {
        const updatePromises = input.kpis.map(({ id, kpiBonusCreateSchema }) => {
          const { weight, ...otherFields } = kpiBonusCreateSchema;

          return tx.kpi.update({
            where: { id },
            data: {
              ...otherFields,
              type: otherFields.type ? otherFields.type as Project : null,
              weight: convertAmountToUnit(Number(weight), 2),
            },
          });
        });

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
      })
    )
    .mutation(async ({ input }) => {
      const updates = await Promise.all(
        input.evaluations.map(async ({ id, ...evaluation }) =>
          prisma.kpiEvaluation.update({
            where: { id },
            data: {
              fileUrl: evaluation.fileUrl,
              actualOwner: evaluation.actualOwner ? evaluation.actualOwner : null,
              achievementOwner: evaluation.achievementOwner ? evaluation.achievementOwner : null,
              actualChecker: evaluation.actualChecker ? evaluation.actualChecker : null,
              achievementChecker: evaluation.achievementChecker ? evaluation.achievementChecker : null,
              actualApprover: evaluation.actualApprover ? evaluation.actualApprover : null,
              achievementApprover: evaluation.achievementApprover ? evaluation.achievementApprover : null,
            },
          })
        )
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
      const kpi = await prisma.kpiEvaluation.update({
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
          kpis: {
            include: {
              kpiEvaluations: true,
            },
          },
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
    })
});