import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { kpiBonusSchema } from "@/modules/performance/schema";
import { TRPCError } from "@trpc/server";

export const bonusProcedure = createTRPCRouter({
  getByEmployeeId: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        year: z.number(),
      })
    )
    .query(async ({ input }) => {
      const records = await prisma.kpiRecord.findMany({
        where: input,
        include: {
          kpis: true,
        }
      });

      // TODO: Handle Demical
      const serialized = records.map(({ totalScore, ...rest }) => ({
        ...rest,
        totalScore: typeof (totalScore as unknown as { toNumber?: () => number }).toNumber === "function"
          ? (totalScore as unknown as { toNumber: () => number }).toNumber()
          : Number(totalScore as unknown as number),
      }));

      return serialized;
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
          kpiRecordId: record.id,
        },
      });

      return res;
    })
});