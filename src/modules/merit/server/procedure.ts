import path from "path";

import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";

import { readCSV } from "@/seeds/utils/csv";
import { App, CompetencyType, Period, Status, Task } from "@/generated/prisma";
import { ApprovalCSVProps } from "@/types/approval";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getUserRole, PermissionContext } from "@/modules/bonus/permission";
import { convertAmountFromUnit, convertAmountToUnit, exportExcel } from "@/lib/utils";
import { competencyEvaluationSchema, cultureEvaluationSchema, meritSchema } from "../schema";
import { MANAGER_UP } from "../type";
import { columns } from "../constants";
import { formatMeritExport } from "../utils";

// Helper functions
async function fetchCommentsForRecords(recordIds: string[]) {
  return prisma.comment.findMany({
    where: {
      connectId: { in: recordIds },
    },
    include: {
      employee: true
    },
    orderBy: {
      createdAt: "asc"
    },
  });
}

type CommentWithEmployee = Awaited<ReturnType<typeof fetchCommentsForRecords>>[0];

function groupCommentsByRecordId(comments: CommentWithEmployee[]) {
  return comments.reduce((acc, comment) => {
    if (!acc[comment.connectId]) {
      acc[comment.connectId] = [];
    }
    acc[comment.connectId].push(comment);
    return acc;
  }, {} as Record<string, CommentWithEmployee[]>);
}

function buildPermissionContext(currentEmployeeId: string, task: Task): PermissionContext {
  return {
    currentEmployeeId,
    documentOwnerId: task.preparedBy,
    checkerId: task.checkedBy,
    approverId: task.approvedBy,
    status: task.status,
  };
}

export const meritProcedure = createTRPCRouter({
  getByYear: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const meritForm = await prisma.meritForm.findFirst({
        where: {
          year: input.year,
          employeeId: ctx.user.employee.id,
        },
        include: {
          tasks: {
            orderBy: {
              preparedAt: "asc"
            },
          },
          competencyRecords: {
            include: {
              competencyEvaluations: true,
            },
          },
          cultureRecords: {
            include: {
              cultureEvaluations: true,
            },
          },
        },
      });

      return {
        id: meritForm?.id,
        task: {
          inDraft: meritForm?.tasks[0],
          evaluation1st: meritForm?.tasks[1],
          evaluation2nd: meritForm?.tasks[2],
        },
        chartInfo: [
          {
            period: "Evaluation 1st",
            competency: {
              owner: convertAmountFromUnit(
                (meritForm?.competencyRecords ?? []).reduce((acc, kpi) => {
                  const evaluation = kpi.competencyEvaluations.find((f) => f.period === Period.EVALUATION_1ST);

                  if (meritForm) {
                    return acc + (((evaluation?.levelOwner ?? 0) / meritForm.competencyRecords.length) * kpi.weight);
                  }

                  return 0;
                }, 0),
                2
              ),
              checker: convertAmountFromUnit(
                (meritForm?.competencyRecords ?? []).reduce((acc, kpi) => {
                  const evaluation = kpi.competencyEvaluations.find((f) => f.period === Period.EVALUATION_1ST);

                  if (meritForm) {
                    return acc + (((evaluation?.levelChecker ?? 0) / meritForm.competencyRecords.length) * kpi.weight);
                  }

                  return 0;
                }, 0),
                2
              ),
              approver: convertAmountFromUnit(
                (meritForm?.competencyRecords ?? []).reduce((acc, kpi) => {
                  const evaluation = kpi.competencyEvaluations.find((f) => f.period === Period.EVALUATION_1ST);

                  if (meritForm) {
                    return acc + (((evaluation?.levelApprover ?? 0) / meritForm.competencyRecords.length) * kpi.weight);
                  }

                  return 0;
                }, 0),
                2
              ),
            },
            culture: {
              owner: convertAmountFromUnit(
                (meritForm?.cultureRecords ?? []).reduce((acc, c) => {
                  const evaluation = c.cultureEvaluations.find((f) => f.period === Period.EVALUATION_1ST);

                  if (meritForm) {
                    return acc + (((evaluation?.levelBehaviorOwner ?? 0) / meritForm.competencyRecords.length) * (30 / meritForm.competencyRecords.length));
                  }

                  return 0;
                }, 0),
                2
              ),
              checker: convertAmountFromUnit(
                (meritForm?.cultureRecords ?? []).reduce((acc, c) => {
                  const evaluation = c.cultureEvaluations.find((f) => f.period === Period.EVALUATION_1ST);

                  if (meritForm) {
                    return acc + (((evaluation?.levelBehaviorChecker ?? 0) / meritForm.competencyRecords.length) * (30 / meritForm.competencyRecords.length));
                  }

                  return 0;
                }, 0),
                2
              ),
              approver: convertAmountFromUnit(
                (meritForm?.cultureRecords ?? []).reduce((acc, c) => {
                  const evaluation = c.cultureEvaluations.find((f) => f.period === Period.EVALUATION_1ST);

                  if (meritForm) {
                    return acc + (((evaluation?.levelBehaviorApprover ?? 0) / meritForm.competencyRecords.length) * (30 / meritForm.competencyRecords.length));
                  }

                  return 0;
                }, 0),
                2
              ),
            }
          },
          {
            period: "Evaluation 2nd",
            competency: {
              owner: convertAmountFromUnit(
                (meritForm?.competencyRecords ?? []).reduce((acc, kpi) => {
                  const evaluation = kpi.competencyEvaluations.find((f) => f.period === Period.EVALUATION_2ND);

                  if (meritForm) {
                    return acc + (((evaluation?.levelOwner ?? 0) / meritForm.competencyRecords.length) * kpi.weight);
                  }

                  return 0;
                }, 0),
                2
              ),
              checker: convertAmountFromUnit(
                (meritForm?.competencyRecords ?? []).reduce((acc, kpi) => {
                  const evaluation = kpi.competencyEvaluations.find((f) => f.period === Period.EVALUATION_2ND);

                  if (meritForm) {
                    return acc + (((evaluation?.levelChecker ?? 0) / meritForm.competencyRecords.length) * kpi.weight);
                  }

                  return 0;
                }, 0),
                2
              ),
              approver: convertAmountFromUnit(
                (meritForm?.competencyRecords ?? []).reduce((acc, kpi) => {
                  const evaluation = kpi.competencyEvaluations.find((f) => f.period === Period.EVALUATION_2ND);

                  if (meritForm) {
                    return acc + (((evaluation?.levelApprover ?? 0) / meritForm.competencyRecords.length) * kpi.weight);
                  }

                  return 0;
                }, 0),
                2
              ),
            },
            culture: {
              owner: convertAmountFromUnit(
                (meritForm?.cultureRecords ?? []).reduce((acc, c) => {
                  const evaluation = c.cultureEvaluations.find((f) => f.period === Period.EVALUATION_2ND);

                  if (meritForm) {
                    return acc + (((evaluation?.levelBehaviorOwner ?? 0) / meritForm.competencyRecords.length) * (30 / meritForm.competencyRecords.length));
                  }

                  return 0;
                }, 0),
                2
              ),
              checker: convertAmountFromUnit(
                (meritForm?.cultureRecords ?? []).reduce((acc, c) => {
                  const evaluation = c.cultureEvaluations.find((f) => f.period === Period.EVALUATION_2ND);

                  if (meritForm) {
                    return acc + (((evaluation?.levelBehaviorChecker ?? 0) / meritForm.competencyRecords.length) * (30 / meritForm.competencyRecords.length));
                  }

                  return 0;
                }, 0),
                2
              ),
              approver: convertAmountFromUnit(
                (meritForm?.cultureRecords ?? []).reduce((acc, c) => {
                  const evaluation = c.cultureEvaluations.find((f) => f.period === Period.EVALUATION_2ND);

                  if (meritForm) {
                    return acc + (((evaluation?.levelBehaviorApprover ?? 0) / meritForm.competencyRecords.length) * (30 / meritForm.competencyRecords.length));
                  }

                  return 0;
                }, 0),
                2
              ),
            }
          },
        ],
      };
    }),
  getByFormId: protectedProcedure
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
          meritForm: {
            include: {
              competencyRecords: {
                include: {
                  competency: true,
                  competencyEvaluations: {
                    where: {
                      period: input.period,
                    },
                  },
                },
                orderBy: {
                  id: "asc",
                },
              },
              cultureRecords: {
                include: {
                  culture: true,
                  cultureEvaluations: {
                    where: {
                      period: input.period,
                    },
                  },
                },
                orderBy: {
                  culture: {
                    id: "asc",
                  }
                },
              },
              employee: true,
            },
          },
        },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const kpiForm = await prisma.kpiForm.findFirst({
        where: {
          employeeId: task.preparer.id,
          year: task.meritForm?.year,
        },
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
      });

      const typeToName: Record<CompetencyType, string> = {
        [CompetencyType.MC]: "Managerial Competency",
        [CompetencyType.FC]: "Functional Competency",
        [CompetencyType.TC]: "Technical Competency",
        [CompetencyType.CC]: "Core Competency",
      };

      const [cultureComments, competencyComments] = await Promise.all([
        fetchCommentsForRecords(task.meritForm?.cultureRecords?.map(r => r.id) ?? []),
        fetchCommentsForRecords(task.meritForm?.competencyRecords?.map(r => r.id) ?? []),
      ]);

      const cultureCommentsMap = groupCommentsByRecordId(cultureComments);
      const competencyCommentsMap = groupCommentsByRecordId(competencyComments);

      const competencyRecordsWithComments =
        MANAGER_UP.includes(task.preparer.rank)
          ? (() => {
            const patternTypes: (CompetencyType | CompetencyType[])[] = [
              [CompetencyType.FC, CompetencyType.TC],
              [CompetencyType.FC, CompetencyType.TC],
              CompetencyType.MC,
              CompetencyType.MC,
            ];
            const records = task.meritForm?.competencyRecords ?? [];

            return records.slice(0, patternTypes.length).map((record, index) => {
              const types = Array.isArray(patternTypes[index])
                ? patternTypes[index] as CompetencyType[]
                : [patternTypes[index] as CompetencyType];

              return {
                ...record,
                comments: competencyCommentsMap[record.id] || [],
                type: types,
                label: types.map((t) => typeToName[t]).join(", "),
              };
            });
          })()
          : (() => {
            const records = task.meritForm?.competencyRecords ?? [];
            return records.map((record) => ({
              ...record,
              comments: competencyCommentsMap[record.id] || [],
              type: [CompetencyType.TC, CompetencyType.FC],
              label: `${typeToName[CompetencyType.TC]}, ${typeToName[CompetencyType.FC]}`,
            }));
          })();

      const cultureRecordsWithComments = task.meritForm?.cultureRecords?.map(record => ({
        ...record,
        comments: cultureCommentsMap[record.id] || [],
        weight: (30 / ((task.meritForm?.cultureRecords?.length ?? 1))) * 100,
      }));

      const permissionContext = buildPermissionContext(ctx.user.employee.id, task);

      return {
        data: {
          ...task,
          meritForm: {
            ...task.meritForm,
            competencyRecords: competencyRecordsWithComments,
            cultureRecords: cultureRecordsWithComments || [],
          },
          kpiForm,
        },
        permission: {
          ctx: permissionContext,
          role: getUserRole(permissionContext),
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

      const taregetApproval = approvalRecords.find((f) => f.employeeId === ctx.user.employee.id);

      if (!taregetApproval) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const cultures = await prisma.culture.findMany({
        orderBy: {
          id: "asc",
        },
      });

      let meritForm = await prisma.meritForm.findFirst({
        where: {
          year: input.year,
          employeeId: ctx.user.employee.id,
        },
        include: {
          competencyRecords: true,
          cultureRecords: true,
        }
      });

      if (!meritForm) {
        meritForm = await prisma.meritForm.create({
          data: {
            year: input.year,
            employeeId: ctx.user.employee.id,
            competencyRecords: {
              createMany: {
                data: Array.from({ length: 4 }, () => ({
                  weight: 0,
                })),
              },
            },
            cultureRecords: {
              createMany: {
                data: cultures.map((cul) => ({
                  cultureId: cul.id,
                })),
              },
            },
          },
          include: {
            competencyRecords: true,
            cultureRecords: true,
          }
        })
      } else {
        const meritFormUpdated = await prisma.meritForm.update({
          where: {
            id: meritForm.id,
          },
          data: {
            period: input.period,
          },
        });

        if (meritFormUpdated && meritFormUpdated.period !== Period.IN_DRAFT) {
          await prisma.competencyEvaluation.createMany({
            data: meritForm.competencyRecords.map((c) => ({
              competencyRecordId: c.id,
              period: meritFormUpdated.period,
            })),
          });

          await prisma.cultureEvaluation.createMany({
            data: meritForm.cultureRecords.map((c) => ({
              cultureRecordId: c.id,
              period: meritFormUpdated.period,
            })),
          });
        }
      }

      const task = await prisma.task.create({
        data: {
          type: App.MERIT,
          fileId: meritForm.id,
          status: Status.IN_DRAFT,
          preparedBy: ctx.user.employee.id,
          approvedBy: taregetApproval.approverEMPID,
          ...(taregetApproval.checkerEMPID && {
            checkedBy: taregetApproval.checkerEMPID,
          }),
        },
      });

      return task;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        meritSchema,
      })
    )
    .mutation(async ({ input }) => {
      // First, get the existing records
      const [existingCompetencyRecords, existingCultureRecords] = await Promise.all([
        prisma.competencyRecord.findMany({
          where: { meritFormId: input.id },
          orderBy: { id: "asc" }
        }),
        prisma.cultureRecord.findMany({
          where: { meritFormId: input.id },
          orderBy: { id: "asc" }
        })
      ]);

      // Update competency records
      await Promise.all(
        input.meritSchema.competencies.map(async (c, index) => {
          if (existingCompetencyRecords[index]) {
            return prisma.competencyRecord.update({
              where: { id: existingCompetencyRecords[index].id },
              data: {
                competencyId: c.competencyId,
                input: c.input,
                output: c.output,
                weight: convertAmountToUnit(parseFloat(c.weight!), 2),
              }
            });
          }
        })
      );

      // Update culture records
      await Promise.all(
        input.meritSchema.cultures.map(async (culture, index) => {
          if (existingCultureRecords[index]) {
            return prisma.cultureRecord.update({
              where: { id: existingCultureRecords[index].id },
              data: {
                evidence: culture.evidence,
              }
            });
          }
        })
      );

      return { success: true };
    }),
  updateEvaluation: protectedProcedure
    .input(
      z.object({
        meritEvaluationSchema: z.object({
          competencies: z.array(competencyEvaluationSchema.omit({ role: true })),
          cultures: z.array(cultureEvaluationSchema.omit({ role: true })),
        }),
      })
    )
    .mutation(async ({ input }) => {
      await Promise.all([
        ...input.meritEvaluationSchema.competencies.map(async ({ id, ...competencies }) =>
          prisma.competencyEvaluation.update({
            where: { id },
            data: {
              ...competencies

            }
          })
        ),
        ...input.meritEvaluationSchema.cultures.map(async ({ id, ...cultures }) =>
          prisma.cultureEvaluation.update({
            where: { id },
            data: { ...cultures }
          })
        ),
      ])

      return { success: true };
    }),
  export: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const meritForm = await prisma.meritForm.findUnique({
        where: {
          id: input.id,
        },
        include: {
          competencyRecords: {
            include: {
              competency: true,
              competencyEvaluations: true,
            },
          },
          cultureRecords: {
            include: {
              culture: true,
              cultureEvaluations: true,
            },
          },
          employee: true,
        },
      });

      if (!meritForm) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const data = formatMeritExport(meritForm);

      const file = exportExcel([
        {
          name: "Merit Summary",
          data,
          columns,
        },
      ]);

      return {
        file,
        id: meritForm.id,
      };
    }),
  updateRecordBulk: protectedProcedure
    .input(
      z.object({
        competency: z.array(z.object({
          id: z.string(),
          competencyId: z.string(),
          weight: z.coerce.number(),
          input: z.string(),
          output: z.string(),
        })),
        culture: z.array(z.object({
          id: z.string(),
          code: z.string(),
          evidence: z.string(),
        }))
      })
    )
    .mutation(async ({ input }) => {
      const result = await prisma.$transaction(async (prisma) => {
        // Validate competencies exist before updating
        const competencyIds = input.competency.map(c => c.competencyId);
        const existingCompetencies = await prisma.competency.findMany({
          where: {
            id: { in: competencyIds }
          }
        });

        const existingCompetencyIds = new Set(existingCompetencies.map(c => c.id));
        const invalidCompetencyIds = competencyIds.filter(id => !existingCompetencyIds.has(id));

        if (invalidCompetencyIds.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Invalid competency IDs: ${invalidCompetencyIds.join(', ')}`
          });
        }

        // Update competency records
        const competencyUpdates = await Promise.all(
          input.competency.map(async (comp) => {
            return prisma.competencyRecord.update({
              where: { id: comp.id },
              data: {
                competencyId: comp.competencyId,
                weight: convertAmountToUnit(comp.weight, 2),
                input: comp.input,
                output: comp.output,
              }
            });
          })
        );

        // Update culture records
        const cultureUpdates = await Promise.all(
          input.culture.map(async (cult) => {
            return prisma.cultureRecord.update({
              where: { id: cult.id },
              data: {
                evidence: cult.evidence,
              }
            });
          })
        );

        return {
          competencyRecords: competencyUpdates,
          cultureRecords: cultureUpdates,
        };
      });

      return result;
    })
});