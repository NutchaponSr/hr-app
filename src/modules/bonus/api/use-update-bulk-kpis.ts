import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

type RequestType = inferProcedureInput<AppRouter["kpiBonus"]["updateBulkKpi"]>;

export const useUpdateBulkKpis = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateBulkKpi = useMutation(trpc.kpiBonus.updateBulkKpi.mutationOptions());

  const mutation = ({ kpis }: RequestType) => {
    toast.loading("Updating KPIs...", { id: "update-bulk-kpi" });

    updateBulkKpi.mutate({ kpis }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiBonus.getById.queryOptions({ id }),
        );

        toast.success("KPIs Updated!", { id: "update-bulk-kpi" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "update-bulk-kpi" });
      },
    });
  }

  return { mutation, opt: updateBulkKpi };
}