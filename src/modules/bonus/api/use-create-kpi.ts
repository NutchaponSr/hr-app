import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

type RequestType = inferProcedureInput<AppRouter["kpiBonus"]["createKpi"]>;

export const useCreateKpi = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createKpi = useMutation(trpc.kpiBonus.createKpi.mutationOptions());

  const mutation = (value: RequestType) => {
    toast.loading("Creating KPI...", { id: "create-kpi" });

    createKpi.mutate({ ...value }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiBonus.getById.queryOptions({ id }),
        );

        toast.success("KPI Created!", { id: "create-kpi" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "create-kpi" });
      },
    });
  }

  return { mutation, opt: createKpi };
}