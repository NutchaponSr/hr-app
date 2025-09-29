import { Position } from "@/generated/prisma";
import { KpiBonusEvaluationSchema } from "./schema";
import { KpiWithEvaluation } from "./types";
import { convertAmountFromUnit } from "@/lib/utils";

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