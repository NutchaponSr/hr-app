import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { kpiBonusSchema } from "@/modules/performance/schema";
import { convertAmountToUnit } from "@/lib/utils";

export const bonusProcedure = createTRPCRouter({
  getByEmployeeId: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        year: z.number(),
      })
    )
    .query(async ({ input }) => {
      const res = await prisma.kpiRecord.findMany({
        where: {
          employeeId: input.employeeId,
        },
        include: {
          kpis: true,
        }
      });

      return {
        years: res.map((kpi) => kpi.year),
        record: res.find((f) => f.year === input.year),
      };
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
            totalScore: 0,
            employeeId: ctx.user.employee.id,
            approvalId: approval.id,
          },
        });
      }

      const res = await prisma.kpi.create({
        data: {
          ...input,
          actual: "",
          achievement: 0,
          weight: convertAmountToUnit(parseFloat(input.weight), 2),
          kpiRecordId: record.id,
        },
      });

      return res;
    })
});