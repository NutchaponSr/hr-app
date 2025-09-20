import path from "path";

import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";

import { readCSV } from "@/seeds/utils/csv";
import { App, Period, Status, Task } from "@/generated/prisma";
import { ApprovalCSVProps } from "@/types/approval";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getUserRole, PermissionContext } from "@/modules/bonus/permission";
import { competencyRecordSchema, cultureRecordSchema } from "../schema";
import { convertAmountToUnit } from "@/lib/utils";

// Helper functions
async function fetchCommentsForRecords(recordIds: string[]) {
  return prisma.comment.findMany({
    where: {
      connectId: { in: recordIds },
    },
    include: { employee: true },
    orderBy: { createdAt: "asc" },
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
            }
          },
        },
      });

      return {
        ...meritForm,
        form: {
          inDraft: meritForm?.tasks[0],
          evaluation1st: meritForm?.tasks[1],
          evaluation2nd: meritForm?.tasks[2],
        }
      };
    }),
  getByFormId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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
                },
                orderBy: {
                  id: "asc",
                },
              },
              cultureRecords: {
                include: {
                  culture: true,
                },
                orderBy: {
                  culture: {
                    id: "asc",
                  }
                },
              },
            },
          },
        },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Fetch comments for competency and culture records
      const [competencyComments, cultureComments] = await Promise.all([
        fetchCommentsForRecords(task.meritForm?.competencyRecords?.map(r => r.id) ?? []),
        fetchCommentsForRecords(task.meritForm?.cultureRecords?.map(r => r.id) ?? []),
      ]);

      // Group comments by record ID
      const competencyCommentsMap = groupCommentsByRecordId(competencyComments);
      const cultureCommentsMap = groupCommentsByRecordId(cultureComments);

      // Attach comments to competency records
      const competencyRecordsWithComments = task.meritForm?.competencyRecords?.map(record => ({
        ...record,
        comments: competencyCommentsMap[record.id] || [],
      }));

      // Attach comments to culture records
      const cultureRecordsWithComments = task.meritForm?.cultureRecords?.map(record => ({
        ...record,
        comment: cultureCommentsMap[record.id] || [],
        weight: (30 / ((task.meritForm?.cultureRecords?.length ?? 1))) * 100,
      }));

      // Build permission context
      const permissionContext = buildPermissionContext(ctx.user.employee.id, task);

      return {
        data: {
          ...task,
          competencyRecords: competencyRecordsWithComments,
          cultureRecords: cultureRecordsWithComments,
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
        })
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
  updateCompetency: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        competencyRecordSchema,
      })
    )
    .mutation(async ({ input }) => {
      const res = await prisma.competencyRecord.update({
        where: {
          id: input.id,
        },
        data: {
          competencyId: input.competencyRecordSchema.competencyId,
          input: input.competencyRecordSchema.input,
          output: input.competencyRecordSchema.output,
          expectedLevel: input.competencyRecordSchema.expectedLevel,
          weight: convertAmountToUnit(parseFloat(input.competencyRecordSchema.weight!), 2),
        },
      });

      return res;
    }),
  updateCulture: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        cultureRecordSchema,
      })
    )
    .mutation(async ({ input }) => {
      const res = await prisma.cultureRecord.update({
        where: {
          id: input.id,
        },
        data: {
          evidence: input.cultureRecordSchema.evdience,
        },
      });

      return res;
    }),
});