import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { convertAmountFromUnit } from "@/lib/utils";

import { KpiFormWithKpi } from "@/modules/bonus/types";
import { Period, Status } from "@/generated/prisma";

export const performanceProcedure = createTRPCRouter({
  getByYear: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ input }) => {
      const result = await prisma.$transaction(async (prisma) => {
        const employees = await prisma.employee.count();

        const forms = await prisma.kpiForm.findMany({
          where: { 
            year: {
              gte: input.year - 1,
              lte: input.year,
            },
          },
          include: {
            kpis: true,
            tasks: true,
          },
        });
  
        const calcAchievementSum = (
          forms: KpiFormWithKpi[],
        ) =>
          forms.reduce((total, form) => {
            const formTotal = form.kpis.reduce((sum, kpi) => {
              return sum + kpi.weight;
            }, 0);
            return total + formTotal;
          }, 0);
      
        const avg = (val: number, count: number) =>
          count > 0
            ? Math.round((convertAmountFromUnit(val, 2) / count) * 100) / 100
            : 0;
      
        // แยก forms เป็น 2 กลุ่ม: ปีนี้ กับ ปีที่แล้ว
        const currentForms = forms.filter((f) => f.year === input.year);
        const previousForms = forms.filter((f) => f.year === input.year - 1);
      
        // ฟังก์ชันคำนวณ finalScore สำหรับชุดฟอร์ม
        const calcFinalScore = (targetForms: KpiFormWithKpi[]) => {
          const sumAchievement2nd = calcAchievementSum(targetForms);
          return avg(sumAchievement2nd, targetForms.length);
        };
      
        // คำนวณ finalScore ของแต่ละปี
        const currentFinalScore = calcFinalScore(currentForms);
        const previousFinalScore = calcFinalScore(previousForms);
      
        // คำนวณข้อมูลรวมปัจจุบัน
        const sumWeight = currentForms.reduce(
          (total, form) =>
            total +
            form.kpis.reduce((sum, kpi) => sum + (kpi.weight || 0), 0),
          0
        );
      
        const sumAchievement1st = calcAchievementSum(currentForms);
      
        const formsEvaluted = currentForms.filter(
          (f) =>
            f.tasks.length === 2 &&
            f.tasks.every((t) => t.status === Status.APPROVED) &&
            f.period === Period.EVALUATION
        ).length;
      
        const formsEvaluting = currentForms.filter((f) =>
          f.tasks.some((t) => t.status !== Status.APPROVED) &&
          f.period === Period.EVALUATION
        ).length;
      
        return {
          employees,
          kpiForms: [
            {
              period: "In Draft",
              value: avg(sumWeight, currentForms.length),
            },
            {
              period: "Evaluation",
              value: avg(sumAchievement1st, currentForms.length),
            },
          ],
          formCount: currentForms.length,
          formsEvaluted,
          formsEvaluting,
          finalScore: currentFinalScore,
          lastYearFinalScore: previousFinalScore,
          diffFromLastYear:
            previousFinalScore > 0
              ? Math.round((currentFinalScore - previousFinalScore) * 100) / 100
              : 0,
        };
      });

      return result;
    }),
  getMany: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ input }) => {
      const startYear = input.year - 4;
      const endYear = input.year;

      const forms = await prisma.kpiForm.findMany({
        where: { 
          year: {
            gte: startYear,
            lte: endYear,
          },
        },
        include: {
          kpis: true,
        },
        orderBy: {
          year: "desc",
        },
      });

      const calcAchievementSum = (forms: KpiFormWithKpi[]) =>
        forms.reduce((total, form) => {
          const formTotal = form.kpis.reduce((sum, kpi) => {
            return sum + kpi.weight;
          }, 0);
          return total + formTotal;
        }, 0);
  
        const results = [];
        for (let year = startYear; year <= endYear; year++) {
          const yearForms = forms.filter((f) => f.year === year);
    
          if (yearForms.length === 0) {
            results.push({
              year,
              inDraft: 0,
              evaluation1st: 0,
              evaluation2nd: 0,
            });
            continue;
          }
    
          const sumWeight = yearForms.reduce(
            (total, form) =>
              total +
              form.kpis.reduce((sum, kpi) => sum + kpi.weight, 0),
            0
          );
    
          const sumAchievement1st = calcAchievementSum(yearForms);
    
          const avg = (val: number) =>
            Math.round(
              (convertAmountFromUnit(val, 2) / yearForms.length) * 100
            ) / 100;
    
          results.push({
            year,
            inDraft: avg(sumWeight),
            evaluation1st: avg(sumAchievement1st),
          });
        }
    
        return results;
  
      return results;
    })
});
