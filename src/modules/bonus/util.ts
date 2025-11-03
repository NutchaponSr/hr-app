import { Kpi, KpiCategory, Period, Position } from "@/generated/prisma";
import { KpiBonusEvaluationSchema } from "./schema";
import { KpiFormWithInfo, KpiWithComments, KpiWithEvaluation } from "./types";
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

export const getEditableFields = (
  role: "preparer" | "checker" | "approver",
) => {
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
  key: "achievementOwner" | "achievementChecker" | "achievementApprover",
) {
  const total = (evaluations || []).reduce((sum, evalItem, idx) => {
    const weight = convertAmountFromUnit(kpis?.[idx]?.weight ?? 0, 2);
    const achievement = Number(evalItem?.[key] ?? 0);

    return sum + (achievement / 100) * weight;
  }, 0);

  return total.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function calculateAchievementSum(
  evaluations: KpiBonusEvaluationSchema[],
  kpis: { weight?: number }[],
  key: "achievementOwner" | "achievementChecker" | "achievementApprover",
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

export function calculateAchievementScore(
  kpis: Array<{
    weight: number;
    kpiEvaluations: Array<{
      period: Period;
      achievementOwner?: number | null;
      achievementChecker?: number | null;
      achievementApprover?: number | null;
    }>;
  }>,
  period: Period,
  role: "achievementOwner" | "achievementChecker" | "achievementApprover",
): number {
  return convertAmountFromUnit(
    kpis.reduce((acc, kpi) => {
      const evaluation = kpi.kpiEvaluations.find((f) => f.period === period);
      const achievement = evaluation?.[role] ?? 0;
      return acc + (achievement / 100) * kpi.weight;
    }, 0),
    2,
  );
}

export function formatKpiExport(kpiForm: KpiFormWithInfo) {
  const calcPercentage = (
    weight: number,
    decimal: number,
    achievement: number,
  ) =>
    (
      convertAmountFromUnit(weight, decimal) *
      ((achievement ?? 0) / 100)
    ).toLocaleString("en-US", {
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

  const createEvaluationData = () =>
    kpiForm.kpis.flatMap((kpi) => {
      const base = {
        employeeId: kpiForm.employeeId,
        employeeName: kpiForm.employee.fullName,
        period: "Evaluation",
        year: kpiForm.year,
        name: kpi.name,
      };

      const performers = [
        { performer: "Owner", score: kpi.achievementOwner },
        { performer: "Checker", score: kpi.achievementChecker },
        { performer: "Approver", score: kpi.achievementApprover },
      ];

      return performers.map((p) => ({
        ...base,
        performer: p.performer,
        percentage: calcPercentage(kpi.weight, 2, p.score || 0),
      }));
    });

  const performerOrder = ["Owner", "Checker", "Approver"];

  const sortByPerformer = (data: Array<{ performer: string }>) =>
    performerOrder.flatMap((role) => data.filter((d) => d.performer === role));

  const sortedEvaluate = sortByPerformer(createEvaluationData());

  return [...inDraft, ...sortedEvaluate];
}

export function bonusEvaluationMapValue(kpi: KpiWithComments) {
  return {
    id: kpi.id,
    name: kpi.name ?? "",
    weight: String(convertAmountFromUnit(kpi.weight, 2)),
    category: kpi.category ?? KpiCategory.FP,
    objective: kpi.objective ?? "",
    definition: kpi.definition ?? "",
    strategy: kpi.strategy ?? "",
    method: kpi.method ?? "",
    type: kpi.type,
    target70: kpi.target70 ?? "",
    target80: kpi.target80 ?? "",
    target90: kpi.target90 ?? "",
    target100: kpi.target100 ?? "",
  };
}
