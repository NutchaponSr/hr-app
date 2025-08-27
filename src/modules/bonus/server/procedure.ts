import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { convertAmountToUnit, findKeyByValue } from "@/lib/utils";

import { App, Status } from "@/generated/prisma";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { kpiBonusSchema } from "@/modules/bonus/schema";
import { projectTypes, strategies } from "@/modules/bonus/constants";
import { getUserRole, PermissionContext } from "../permission";

export const bonusProcedure = createTRPCRouter({
  getInfo: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const res = await prisma.kpiRecord.findMany({
        where: {
          employeeId: ctx.user.employee.id,
        },
        include: {
          kpis: {
            orderBy: {
              createdAt: "asc",
            },
          },
          KpiEvaluations: {
            include: {
              approval: {
                include: {
                  preparer: true,
                  checker: true,
                  approver: true,
                }
              },
            }
          },
        },
      });

      const record = res.find((f) => f.year === input.year);

      let permissionContext: PermissionContext | null = null;
      let userRole: string | null = null;

      if (record) {
        const latestEvaluation = record.KpiEvaluations.sort((a, b) => b.period - a.period)[0];

        if (latestEvaluation?.approval) {
          const approval = latestEvaluation.approval;

          permissionContext = {
            currentEmployeeId: ctx.user.employee.id,
            documentOwnerId: approval.preparedBy,
            checkerId: approval.checkedBy || undefined,
            approverId: approval.approvedBy,
            status: record.status
          };

          userRole = getUserRole(permissionContext);
        }
      }

      return {
        record,
        years: res.map((kpi) => kpi.year),
        permission: {
          context: permissionContext,
          userRole,
        },
      };
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await prisma.kpiRecord.findUnique({
        where: {
          employeeId_year: {
            employeeId: ctx.user.employee.id,
            year: input.year,
          },
        },
      });

      return res;
    }),
  instantCreate: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const employeeId = ctx.user.employee.id;

      let record = await prisma.kpiRecord.findUnique({
        where: {
          employeeId_year: { employeeId, year: input.year },
        },
      });

      if (!record) {
        const approval = await prisma.approval.findFirst({
          select: {
            id: true,
          },
          where: {
            preparedBy: ctx.user.employee.id,
            app: "KPI",
          },
        });

        if (!approval) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Not found approval KPI for this employee" });
        }

        record = await prisma.kpiRecord.create({
          data: {
            year: input.year,
            status: Status.IN_DRAFT,
            employeeId: ctx.user.employee.id,
          },
        });
      }

      const res = await prisma.kpi.create({
        data: {
          kpiRecord: {
            connect: {
              id: record.id,
            },
          },
        },
        include: {
          kpiRecord: true,
        },
      });

      await prisma.kpiRecord.update({
        where: { 
          id: res.kpiRecordId, 
        },
        data: { 
          updatedAt: new Date(), 
        },
      });

      return res;
    }),
  createRecord: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const approval = await prisma.approval.findFirst({
        where: {  
          app: App.KPI,
          preparedBy: ctx.user.employee.id,
        },
      });

      if (!approval) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const res = await prisma.kpiRecord.create({
        data: {
          employeeId: ctx.user.employee.id,
          year: input.year,
          KpiEvaluations: {
            create: {
              period: 1,
              approval: {
                connect: {
                  id: approval.id,
                },
              },
            },
          },
        },
      });

      return res;
    }),
  create: protectedProcedure
    .input(kpiBonusSchema)
    .mutation(async ({ ctx, input }) => {
      const employeeId = ctx.user.employee.id;
      const year = new Date().getFullYear();

      let record = await prisma.kpiRecord.findUnique({
        where: {
          employeeId_year: { employeeId, year },
        },
      });

      if (!record) {
        const approval = await prisma.approval.findFirst({
          select: {
            id: true,
          },
          where: {
            preparedBy: ctx.user.employee.id,
            app: "KPI",
          },
        });

        if (!approval) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Not found approval KPI for this employee" });
        }

        record = await prisma.kpiRecord.create({
          data: {
            year,
            employeeId: ctx.user.employee.id,
          },
        });
      }

      const res = await prisma.kpi.create({
        data: {
          ...input,
          weight: convertAmountToUnit(parseFloat(input.weight), 2),
          kpiRecord: {
            connect: {
              id: record.id,
            },
          }
        },
        include: {
          kpiRecord: true,
        }
      });

      await prisma.kpiRecord.update({
        where: { 
          id: res.kpiRecordId, 
        },
        data: { 
          updatedAt: new Date(), 
        },
      });

      return res;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().nullable().optional(),
        weight: z.string().nullable().optional(),
        strategy: z.string().nullable().optional(),
        type: z.string().nullable().optional(),
        target100: z.string().nullable().optional(),
        target90: z.string().nullable().optional(),
        target80: z.string().nullable().optional(),
        target70: z.string().nullable().optional(),
        definition: z.string().nullable().optional(),
        objective: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input;

      const fieldsToUpdate = Object.fromEntries(
        Object.entries(updateFields).filter(([, value]) => value !== undefined)
      );

      const transformedData = {
        ...fieldsToUpdate,
        ...(fieldsToUpdate.strategy !== undefined && {
          strategy: fieldsToUpdate.strategy ? findKeyByValue(strategies, String(fieldsToUpdate.strategy)) : null
        }),
        ...(fieldsToUpdate.type !== undefined && {
          type: fieldsToUpdate.type ? findKeyByValue(projectTypes, String(fieldsToUpdate.type)) : null
        }),
        ...(fieldsToUpdate.weight !== undefined && {
          weight: fieldsToUpdate.weight !== null ? convertAmountToUnit(Number(fieldsToUpdate.weight), 2) : null
        }),
      };

      const res = await prisma.kpi.update({
        where: { id },
        data: transformedData,
      });

      await prisma.kpiRecord.update({
        where: { 
          id: res.kpiRecordId, 
        },
        data: { 
          updatedAt: new Date(), 
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
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Validate kpis and weight

      const res = await prisma.kpiRecord.update({
        where: {
          id: input.id,
        },
        data: {
          status: Status.PENDING_CHECKER
        }
      });

      if (!res) { 
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return res;
    })
});