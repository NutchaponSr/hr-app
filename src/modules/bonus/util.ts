import { Period, Position } from "@/generated/prisma";
import { KpiBonusEvaluationSchema } from "./schema";
import { KpiFormWithInfo, KpiWithEvaluation } from "./types";
import { convertAmountFromUnit } from "@/lib/utils";
import { periods } from "./constants";

export function validateWeight(position: Position) {
  switch (position) {
    case Position.Chief:
      return 40;
    case Position.President:
    case Position.MD:
    case Position.VP:
    case Position.GM:
    case Position.AGM:
    case Position.MGR:
    case Position.SMGR:
      return 50;
    case Position.Foreman:
    case Position.Staff:
    case Position.Worker:
    case Position.Officer:
      return 30;
    default:
      return 30;
  }
}

export const getEditableFields = (role: "preparer" | "checker" | "approver") => {
  switch (role) {
    case "preparer":
      return ["actualOwner", "achievementOwner"];
    case "checker":
      return ["actualChecker", "achievementChecker"];
    case "approver":
      return ["actualApprover", "achievementApprover"];
    default:
      return [];
  }
};

export function getTotalWithWeight(
  evaluations: KpiBonusEvaluationSchema[],
  kpis: KpiWithEvaluation[],
  key: "achievementOwner" | "achievementChecker" | "achievementApprover"
) {
  const total = (evaluations || []).reduce((sum, evalItem, idx) => {
    const weight = convertAmountFromUnit(
      (kpis?.[idx]?.weight ?? 0),
      2
    );
    const achievement = Number(evalItem?.[key] ?? 0);

    return sum + ((achievement / 100) * weight);
  }, 0);

  return total.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function calculateAchievementSum(
  evaluations: KpiBonusEvaluationSchema[],
  kpis: { weight?: number }[],
  key: "achievementOwner" | "achievementChecker" | "achievementApprover"
): number {
  return (evaluations || []).reduce((acc, comp, idx) => {
    const level = Number(comp[key] ?? 0);
    const weight = convertAmountFromUnit(kpis[idx]?.weight ?? 0, 2);
    
    return acc + (level / 100) * weight;
  }, 0);
}

export function formatAchievementSum(sum: number): string {
  return sum.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function formatKpiExport(kpiForm: KpiFormWithInfo) {
  const calcPercentage = (weight: number, decimal: number, achievement: number) =>
    (convertAmountFromUnit(weight, decimal) * ((achievement ?? 0) / 100)).toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

  const inDraft = kpiForm.kpis.map((kpi) => ({
    employeeId: kpiForm.employeeId,
    employeeName: kpiForm.employee.fullName,
    year: kpiForm.year,
    period: periods[Period.IN_DRAFT],
    performer: "Approver",
    name: kpi.name,
    percentage: convertAmountFromUnit(kpi.weight, 2).toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }),
  }));

  const createEvaluationData = (period: Period) =>
    kpiForm.kpis.flatMap((kpi) => {
      const evaluation = kpi.kpiEvaluations.find(
        (f) => f.period === period
      );

      const base = {
        employeeId: kpiForm.employeeId,
        employeeName: kpiForm.employee.fullName,
        year: kpiForm.year,
        period: periods[period],
        name: kpi.name,
      };

      const performers = [
        { performer: "Owner", score: evaluation?.achievementOwner },
        { performer: "Checker", score: evaluation?.achievementChecker },
        { performer: "Approver", score: evaluation?.achievementApprover },
      ];

      return performers.map((p) => ({
        ...base,
        performer: p.performer,
        percentage: calcPercentage(kpi.weight, 2, p.score || 0),
      }));
    });

  const evaluation1st = createEvaluationData(Period.EVALUATION_1ST);
  const evaluation2nd = createEvaluationData(Period.EVALUATION_2ND);

  const performerOrder = ["Owner", "Checker", "Approver"];

  const sortByPerformer = (data: Array<{ performer: string }>) =>
    performerOrder.flatMap((role) => data.filter((d) => d.performer === role));

  const sortedEval1st = sortByPerformer(evaluation1st);
  const sortedEval2nd = sortByPerformer(evaluation2nd);

  return [...inDraft, ...sortedEval1st, ...sortedEval2nd];
}