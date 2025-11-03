import { toast } from "sonner";
import { Table } from "@tanstack/react-table";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

import { KpiWithComments } from "@/modules/bonus/types";
import { usePeriod } from "@/hooks/use-period";

type RequestType = inferProcedureInput<AppRouter["kpiBonus"]["deleteBulkKpi"]>;

export const useDeleteBulkKpis = (table: Table<KpiWithComments>, id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { period } = usePeriod();

  const deleteBulkKpi = useMutation(trpc.kpiBonus.deleteBulkKpi.mutationOptions());

  const mutation = (value: RequestType) => {
    toast.loading("Deleting KPIs...", { id: "delete-bulk-kpi" });

    deleteBulkKpi.mutate({ ...value }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiBonus.getById.queryOptions({ id, period }),
        );

        table.resetRowSelection();
        toast.success("KPIs deleted!", { id: "delete-bulk-kpi" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "delete-bulk-kpi" });
      },
    });
  }

  return { mutation, isPending: deleteBulkKpi.isPending };
}