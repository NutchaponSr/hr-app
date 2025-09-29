import { CompetencyType, Position } from "@/generated/prisma";

import { CHIEF_DOWN, MANAGER_UP } from "@/modules/merit/type";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

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
  }
}