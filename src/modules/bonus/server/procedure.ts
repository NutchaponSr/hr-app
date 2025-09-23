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
          tasks: {
            orderBy: {
              preparedAt: "asc",
            },
          },
        },
      });

      return {
        ...kpiForm,
        task: {
          inDraft: kpiForm?.tasks[0],
          evaluation1st: kpiForm?.tasks[1],
          evaluation2nd: kpiForm?.tasks[2],
        },
      };
    }),
  getById: protectedProcedure
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
      });

      if (!kpiForm) {
        kpiForm = await prisma.kpiForm.create({
          data: {
            year: input.year,
            employeeId: ctx.user.employee.id,
          },
        })
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
});