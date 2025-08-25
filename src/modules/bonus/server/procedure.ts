import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { convertAmountToUnit, findKeyByValue } from "@/lib/utils";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { kpiBonusSchema } from "@/modules/bonus/schema";
import { projectTypes, strategies } from "../constants";

export const bonusProcedure = createTRPCRouter({
  getByEmployeeId: protectedProcedure
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
        },
      });

      return {
        years: res.map((kpi) => kpi.year),
        record: res.find((f) => f.year === input.year),
      };
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
            employeeId: ctx.user.employee.id,
          },
        });
      }

      const res = await prisma.kpi.create({
        data: {
          kpiRecordId: record.id,
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
      const res = await prisma.kpiRecord.create({
        data: {
          employeeId: ctx.user.employee.id,
          year: input.year,
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
          kpiRecordId: record.id,
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
    })
});