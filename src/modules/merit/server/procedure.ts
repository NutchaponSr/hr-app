import path from "path";

import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";

import { readCSV } from "@/seeds/utils/csv";
import { App, Status } from "@/generated/prisma";
import { ApprovalCSVProps } from "@/types/approval";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getUserRole, PermissionContext } from "@/modules/bonus/permission";
import { competencyRecordSchema } from "../schema";
import { convertAmountToUnit } from "@/lib/utils";

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
      const res = await prisma.meritForm.findUnique({
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
          competencyRecords: {
            include: {
              competency: true,
            },
            orderBy: {
              id: "asc",
            },
          },
          cultureRecords: true,
        },
      });

      if (!res) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const competencyWithComments = await prisma.comment.findMany({
        where: {
          connectId: {
            in: res.competencyRecords.map((c) => c.id),
          },
        },
        include: {
          employee: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const commentsByKpiId = competencyWithComments.reduce((acc, comment) => {
        if (!acc[comment.connectId]) {
          acc[comment.connectId] = [];
        }
        acc[comment.connectId].push(comment);
        return acc;
      }, {} as Record<string, typeof competencyWithComments>);

      const kpisWithComments = res.competencyRecords.map(kpi => ({
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
          competencyRecords: kpisWithComments,
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
              data: Array.from({ length: 4 }, () => ({})),
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
          weight: convertAmountToUnit(parseFloat(input.competencyRecordSchema.weight!), 2),
        },
      });

      return res;
    })
});