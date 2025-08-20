import cultures from "@/modules/merit/json/culture.json";

import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { prisma } from "@/lib/prisma";
import { convertAmountToUnit } from "@/lib/utils";

export const meritProcedure = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const bonusRec = await prisma.kpiRecord.findUnique({
        where: {
          employeeId_year: {
            employeeId: ctx.user.employee.id,
            year: input.year,
          },
        },
      });

      const res = await prisma.meritRecord.findMany({
        where: {
          employeeId: ctx.user.employee.id,
        },
        include: {
          cultureRecord: {
            include: {
              cultureItems: true,
            },
          },
          competencyRecord: {
            include: {
              competencyItem: {
                include: {
                  competency: true,
                }
              },
            },
          },
        },
      });

      return {
        years: res.map((merit) => merit.year),
        record: res.find((f) => f.year === input.year),
        warning: !bonusRec ? "KPI Bonus record not found. you must create KPI Bonus at first" : null
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const bonusRec = await prisma.kpiRecord.findUnique({
        where: {
          employeeId_year: {
            employeeId: ctx.user.employee.id,
            year: input.year,
          },
        },
      });

      if (!bonusRec) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "KPI Bonus not found",
        });
      }

      const res = await prisma.meritRecord.create({
        data: {
          year: input.year,
          kpiRecordId: bonusRec.id,
          employeeId: ctx.user.employee.id,
        },
      });

      await Promise.all([
        prisma.competencyRecord.create({
          data: {
            meritRecordId: res.id,
            competencyItem: {
              createMany: {
                data: Array.from({ length: 4 }).map(() => ({
                  weight: 0,
                }))
              }
            }
          },
        }),
        prisma.cultureRecord.create({
          data: {
            meritRecordId: res.id,
            period: 1,
            cultureItems: {
              createMany: {
                data: cultures.map((item) => ({
                  code: item.cultureCode,
                }))
              },
            },
          },
        }),
      ]);

      return { success: true };
    }),
  updateCulture: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        evidence: z.string().nullable().optional(),
        levelBehavior: z.number().nullable().optional()
      })
    )
    .mutation(async ({ input }) => {
      const res = await prisma.cultureItem.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          levelBehavior: convertAmountToUnit(
            input.levelBehavior === undefined ? null : input.levelBehavior,
            2
          ) ?? 0,
        },
      });

      return res;
    }),
  updateCompetency: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        competencyId: z.string().nullable().optional(),
        output: z.string().nullable().optional(),
        input: z.string().nullable().optional(),
        weight: z.number().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const res = await prisma.competencyItem.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          weight: convertAmountToUnit(
            input.weight === undefined || input.weight === null ? null : input.weight,
            2
          ) ?? 0,
        },
      });

      return res;
    })
}); 