import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

type RequestType = inferProcedureInput<AppRouter["task"]["confirmation"]>;

export const useApprovalMerit = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const confirmation = useMutation(trpc.task.confirmation.mutationOptions());

  const mutation = (value: RequestType) => {
    toast.loading("Confirming workflow...", { id: "approval" });

    confirmation.mutate({ ...value }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiMerit.getByFormId.queryOptions({ id }),
        );

        toast.success("Workflow Confirmed!", { id: "approval" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "approval" });
      },
    });
  }

  return { mutation, opt: confirmation };
}