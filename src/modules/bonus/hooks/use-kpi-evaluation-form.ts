import { useCallback, useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kpiBonusEvaluationsSchema, KpiBonusEvaluationsSchema } from "../schema";
import { KpiWithEvaluation } from "../types";
import { Role } from "../permission";

interface UseKpiEvaluationFormProps {
  kpis: KpiWithEvaluation[] | undefined;
  role: Role;
}

export const useKpiEvaluationForm = ({ kpis, role }: UseKpiEvaluationFormProps) => {
  const mapValue = useCallback((kpi: KpiWithEvaluation, userRole: Role) => {
    const evaluation = kpi.kpiEvaluations[0];
    
    return {
      id: evaluation?.id || "",
      role: userRole,
      fileUrl: evaluation?.fileUrl ?? null,
      actualOwner: evaluation?.actualOwner ?? "",
      achievementOwner: Number(evaluation?.achievementOwner ?? 0),
      actualChecker: evaluation?.actualChecker ?? "",
      achievementChecker: Number(evaluation?.achievementChecker ?? 0),
      actualApprover: evaluation?.actualApprover ?? "",
      achievementApprover: Number(evaluation?.achievementApprover ?? 0),
    };
  }, []);

  const defaultValues = useMemo(() => ({
    evaluations: (kpis || []).map(kpi => mapValue(kpi, role))
  }), [kpis, role, mapValue]);

  const form = useForm<KpiBonusEvaluationsSchema>({
    resolver: zodResolver(kpiBonusEvaluationsSchema) as Resolver<KpiBonusEvaluationsSchema>,
    defaultValues,
  });

  useEffect(() => {
    if (!kpis) return;
    form.reset({
      evaluations: (kpis || []).map(kpi => mapValue(kpi, role)),
    }, {
      keepDirty: false,
      keepTouched: false,
    });
  }, [form, kpis, role, mapValue]);

  return form;
};