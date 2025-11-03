import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

import { usePeriod } from "@/hooks/use-period";

type RequestType = inferProcedureInput<AppRouter["kpiBonus"]["createBulkKpi"]>;

export const useCreateBulkKpis = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { period } = usePeriod();
  
  const createBulkKpi = useMutation(trpc.kpiBonus.createBulkKpi.mutationOptions());

  const mutation = (value: RequestType) => {
    toast.loading("Creating KPIs...", { id: "create-bulk-kpis" });

    createBulkKpi.mutate({ ...value }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiBonus.getById.queryOptions({ id, period }),
        );

        toast.success("KPIs Created!", { id: "create-bulk-kpis" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "create-bulk-kpis" });
      },
    });
  }

  return { mutation, opt: createBulkKpi };
}