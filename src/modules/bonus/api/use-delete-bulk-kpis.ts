import { toast } from "sonner";
import { Table } from "@tanstack/react-table";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

import { KpiWithComments } from "@/modules/bonus/types";

type RequestType = inferProcedureInput<AppRouter["kpiBonus"]["deleteBulkKpi"]>;

export const useDeleteBulkKpi = (table: Table<KpiWithComments>, id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteBulkKpi = useMutation(trpc.kpiBonus.deleteBulkKpi.mutationOptions());

  const mutation = (value: RequestType) => {
    toast.loading("Deleting KPIs...", { id: "delete-bulk-kpi" });

    deleteBulkKpi.mutate({ ...value }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiBonus.getById.queryOptions({ id }),
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