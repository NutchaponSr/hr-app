import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

type RequestType = inferProcedureInput<AppRouter["kpiBonus"]["updateBulkKpiEvaluation"]>;

export const useUpdateBulkKpiEvaluations = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateBulkKpi = useMutation(trpc.kpiBonus.updateBulkKpiEvaluation.mutationOptions());

  const mutation = ({ evaluations }: RequestType) => {
    toast.loading("Updating KPIs...", { id: "update-bulk-kpi-evaluations" });

    updateBulkKpi.mutate({ evaluations }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiBonus.getById.queryOptions({ id }),
        );

        toast.success("KPIs Updated!", { id: "update-bulk-kpi-evaluations" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "update-bulk-kpi-evaluations" });
      },
    });
  }

  return { mutation, opt: updateBulkKpi };
}