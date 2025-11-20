import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { useSave } from "@/hooks/use-save";
import { usePeriod } from "@/hooks/use-period";

type RequestType = inferProcedureInput<AppRouter["kpiBonus"]["updateBulkKpi"]> & { isSubmit: boolean };

export const useUpdateBulkKpis = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { setSave } = useSave();
  const { period } = usePeriod();

  const updateBulkKpi = useMutation(trpc.kpiBonus.updateBulkKpi.mutationOptions());

  const mutation = ({ kpis, isSubmit }: RequestType) => {
    toast.loading("Updating KPIs...", { id: "update-bulk-kpi" });

    updateBulkKpi.mutate({ kpis }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiBonus.getById.queryOptions({ id, period }),
        );

        if (isSubmit) {
          setSave(true);
        }
        
        toast.success("KPIs Updated!", { id: "update-bulk-kpi" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "update-bulk-kpi" });
      },
    });
  }

  return { mutation, opt: updateBulkKpi };
}