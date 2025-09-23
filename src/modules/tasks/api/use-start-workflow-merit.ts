import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

type RequestType = inferProcedureInput<AppRouter["task"]["startWorkflow"]>;

export const useStartWorkflowMerit = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const startWorkflow = useMutation(trpc.task.startWorkflow.mutationOptions());

  const mutation = (value: RequestType) => {
    toast.loading("Starting workflow...", { id: "start-workflow-merit" });

    startWorkflow.mutate({ ...value }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiMerit.getByFormId.queryOptions({ id }),
        );

        toast.success("Workflow started!", { id: "start-workflow-merit" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "start-workflow-merit" });
      },
    });
  }

  return { mutation, opt: startWorkflow };
}