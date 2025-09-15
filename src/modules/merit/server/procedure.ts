import path from "path";

import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";

import { readCSV } from "@/seeds/utils/csv";
import { App, Status, Task } from "@/generated/prisma";
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
    checkerId: task.checkedBy || undefined,
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
      const res = await prisma.meritForm.findFirst({
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
      // Fetch merit form with all related data
      const meritForm = await prisma.meritForm.findUnique({
        where: { id: input.id },
        include: {
          task: {
            include: {
              preparer: true,
              checker: true,
              approver: true,
            }
          },
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
      });

      if (!meritForm) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Fetch comments for competency and culture records
      const [competencyComments, cultureComments] = await Promise.all([
        fetchCommentsForRecords(meritForm.competencyRecords.map(r => r.id)),
        fetchCommentsForRecords(meritForm.cultureRecords.map(r => r.id)),
      ]);

      // Group comments by record ID
      const competencyCommentsMap = groupCommentsByRecordId(competencyComments);
      const cultureCommentsMap = groupCommentsByRecordId(cultureComments);

      // Attach comments to competency records
      const competencyRecordsWithComments = meritForm.competencyRecords.map(record => ({
        ...record,
        comments: competencyCommentsMap[record.id] || [],
      }));

      // Attach comments to culture records
      const cultureRecordsWithComments = meritForm.cultureRecords.map(record => ({
        ...record,
        comment: cultureCommentsMap[record.id] || [],
        weight: (30 / meritForm.cultureRecords.length) * 100,
      }));

      // Build permission context
      const permissionContext = buildPermissionContext(ctx.user.employee.id, meritForm.task);

      return {
        data: {
          ...meritForm,
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
          type: App.MERIT,
          status: Status.IN_DRAFT,
          preparedBy: ctx.user.employee.id,
          approvedBy: taregetApproval.approverEMPID,
          ...(taregetApproval.checkerEMPID && {
            checkedBy: taregetApproval.checkerEMPID,
          }),
        },
      });

      const cultures = await prisma.culture.findMany({
        orderBy: {
          id: "asc",
        },
      });

      const res = await prisma.meritForm.create({
        data: {
          year: input.year,
          employeeId: ctx.user.employee.id,
          taskId: task.id,
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
      });

      return res;
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