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

export function meritDraftMapValue(merit: inferProcedureOutput<AppRouter["kpiMerit"]["getByFormId"]>) {
  return {
    competencies: merit.data.meritForm.competencyRecords?.map(record => ({
      id: record.id,
      competencyId: record.competencyId || "",
      input: record.input || "",
      output: record.output || "",
      weight: convertAmountFromUnit(record.weight, 2).toString(),
      types: record.type,
      label: record.label,
      t1: record.competency?.t1,
      t2: record.competency?.t2,
      t3: record.competency?.t3,
      t4: record.competency?.t4,
      t5: record.competency?.t5,
      comments: record.comments,
    })) || [],
    cultures: merit.data.meritForm.cultureRecords?.map(record => ({
      id: record.id,
      cultureId: record.cultureId,
      evidence: record.evidence || "",
      code: record.culture.code,
      name: record.culture.name,
      description: record.culture.description,
      weight: convertAmountFromUnit(record.weight, 2).toString(),
      comments: record.comments,
    })) || [],
  }
}

export function meritEvaluationMapValue(merit: inferProcedureOutput<AppRouter["kpiMerit"]["getByFormId"]>, period: Period) {
  const role = merit.permission.role || "preparer";

  const competencies = merit.data.meritForm.competencyRecords.map((record) => {
    const evaluation = record.competencyEvaluations.find((evaluation) => evaluation.period === period);
    
    return {
      id: evaluation?.id, // or evaluation.id, depending on your data structure
      role: role,
      result: evaluation?.result,
      fileUrl: evaluation?.fileUrl,
      actualOwner: evaluation?.actualOwner,  
      levelOwner: evaluation?.levelOwner,
      actualChecker: evaluation?.actualChecker,
      levelChecker: evaluation?.levelChecker,
      actualApprover: evaluation?.actualApprover,
      levelApprover: evaluation?.levelApprover,
    };
  }); 

  const cultures = merit.data.meritForm.cultureRecords.map((record) => {
    const evaluation = record.cultureEvaluations.find((evaluation) => evaluation.period === period);
    
    return {
      id: evaluation?.id,
      role: role,
      result: evaluation?.result,
      fileUrl: evaluation?.fileUrl,
      actualOwner: evaluation?.actualOwner,
      levelBehaviorOwner: evaluation?.levelBehaviorOwner,
      actualChecker: evaluation?.actualChecker,
      levelBehaviorChecker:evaluation?.levelBehaviorChecker,
      actualApprover: evaluation?.actualApprover,
      levelBehaviorApprover: evaluation?.levelBehaviorApprover,
    };
  });

  return {
    competencies,
    cultures,
    period: merit.data.meritForm.period,
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
