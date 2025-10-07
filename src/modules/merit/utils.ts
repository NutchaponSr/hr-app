import { CompetencyType, Period, Position } from "@/generated/prisma";

import { CHIEF_DOWN, MANAGER_UP, MeritFormWithInfo } from "@/modules/merit/type";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";
import { convertAmountFromUnit } from "@/lib/utils";
import { periods } from "../bonus/constants";

export function getAvailableCompetencyTypes(position: Position) {
  if (MANAGER_UP.includes(position)) {
    return [CompetencyType.MC, CompetencyType.FC];
  }

  if (CHIEF_DOWN.includes(position)) {
    return [CompetencyType.TC, CompetencyType.FC];
  }

  return [];
}

export function meritEvaluationMapValue(merit: inferProcedureOutput<AppRouter["kpiMerit"]["getByFormId"]>) {
  const role = merit.permission.role || "preparer";

  const competencies = merit.data.meritForm.competencyRecords.map((record) => {
    const evaluation = record.competencyEvaluations[0];
    
    return {
      id: evaluation.id, // or evaluation.id, depending on your data structure
      role: role,
      
      // Owner fields
      inputEvidenceOwner: evaluation.inputEvidenceOwner,
      outputEvidenceOwner: evaluation.outputEvidenceOwner,
      levelOwner: evaluation.levelOwner,
      
      // Checker fields
      inputEvidenceChecker: evaluation.inputEvidenceChecker,
      outputEvidenceChecker: evaluation.outputEvidenceChecker,
      levelChecker: evaluation.levelChecker,
      
      // Approver fields
      inputEvidenceApprover: evaluation.inputEvidenceApprover,
      outputEvidenceApprover: evaluation.outputEvidenceApprover,
      levelApprover: evaluation.levelApprover,
    };
  }); 

  const cultures = merit.data.meritForm.cultureRecords.map((record) => {
    // Get the first evaluation (or handle multiple evaluations as needed)
    const evaluation = record.cultureEvaluations[0];
    
    return {
      id: evaluation.id, // or evaluation.id, depending on your data structure
      role: role,
      
      // Behavior level fields for each role
      levelBehaviorOwner: evaluation.levelBehaviorOwner,
      levelBehaviorChecker:evaluation.levelBehaviorChecker,
      levelBehaviorApprover: evaluation.levelBehaviorApprover,
      actualOwner: evaluation.actualOwner,
      actualChecker: evaluation.actualChecker,
      actualApprover: evaluation.actualApprover,
    };
  });

  const kpis = merit.data.kpiForm?.kpis.map((kpi) => {
    const evaluation = kpi.kpiEvaluations[0];

    return {
      role,
      id: evaluation.id,
      actualOwner: evaluation.actualOwner,
      achievementOwner: evaluation.achievementOwner,
      actualChecker: evaluation.actualChecker,
      achievementChecker: evaluation.achievementChecker,
      actualApprover: evaluation.actualApprover,
      achievementApprover: evaluation.achievementApprover,
      fileUrl: evaluation.fileUrl,
    }
  })

  return {
    competencies,
    cultures,
    kpis
  }
}

export function formatMeritExport(meritForm: MeritFormWithInfo) {
  const calcPercentage = (weight: number, decimal: number, achievement?: number) =>
    (convertAmountFromUnit(weight, decimal) * ((achievement ?? 0) / 100)).toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

  // 🟢 IN_DRAFT
  const inDraft = [
    // Competency
    ...meritForm.competencyRecords.map((c) => ({
      employeeId: meritForm.employeeId,
      employeeName: meritForm.employee.fullName,
      year: meritForm.year,
      period: periods[Period.IN_DRAFT],
      performer: "Approver",
      type: "Competency",
      name: c.competency?.name,
      percentage: convertAmountFromUnit(c.weight, 2).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
    })),

    // Culture
    ...meritForm.cultureRecords.map((c) => ({
      employeeId: meritForm.employeeId,
      employeeName: meritForm.employee.fullName,
      year: meritForm.year,
      period: periods[Period.IN_DRAFT],
      performer: "Approver",
      type: "Culture",
      name: c.culture.code,
      percentage: (30 / meritForm.cultureRecords.length).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
    })),
  ];

  // 🟡 Helper function สำหรับ Evaluation (1st / 2nd)
  const createEvaluationData = (periodType: Period) => {
    const competency = meritForm.competencyRecords.flatMap((c) => {
      const evaluation = c.competencyEvaluations.find((e) => e.period === periodType);

      const base = {
        employeeId: meritForm.employeeId,
        employeeName: meritForm.employee.fullName,
        year: meritForm.year,
        period: periods[periodType],
        type: "Competency" as const,
        name: c.competency?.name,
      };

      const performers = [
        { performer: "Owner", score: evaluation?.levelOwner },
        { performer: "Checker", score: evaluation?.levelChecker },
        { performer: "Approver", score: evaluation?.levelApprover },
      ];

      return performers.map((p) => ({
        ...base,
        performer: p.performer,
        percentage: calcPercentage(c.weight, 4, p.score || 0),
      }));
    });

    const culture = meritForm.cultureRecords.flatMap((c) => {
      const evaluation = c.cultureEvaluations.find((e) => e.period === periodType);

      const base = {
        employeeId: meritForm.employeeId,
        employeeName: meritForm.employee.fullName,
        year: meritForm.year,
        period: periods[periodType],
        type: "Culture" as const,
        name: c.culture.code,
      };

      const weight = 30 / meritForm.cultureRecords.length;

      const performers = [
        { performer: "Owner", score: evaluation?.levelBehaviorOwner },
        { performer: "Checker", score: evaluation?.levelBehaviorChecker },
        { performer: "Approver", score: evaluation?.levelBehaviorApprover },
      ];

      return performers.map((p) => ({
        ...base,
        performer: p.performer,
        percentage: calcPercentage(weight, 4, p.score || 0),
      }));
    });

    return [...competency, ...culture];
  };

  // 🔵 EVALUATION_1ST + EVALUATION_2ND
  const evaluation1st = createEvaluationData(Period.EVALUATION_1ST);
  const evaluation2nd = createEvaluationData(Period.EVALUATION_2ND);

  // 🔴 เรียง performer
  const performerOrder = ["Owner", "Checker", "Approver"];
  const sortByPerformer = (data: Array<{ performer: string }>) =>
    performerOrder.flatMap((role) => data.filter((d) => d.performer === role));

  const sortedEval1st = sortByPerformer(evaluation1st);
  const sortedEval2nd = sortByPerformer(evaluation2nd);

  // 🟣 รวมทั้งหมด
  return [...inDraft, ...sortedEval1st, ...sortedEval2nd];
}
