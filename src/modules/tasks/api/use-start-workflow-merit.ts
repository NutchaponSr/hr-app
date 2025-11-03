import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { usePeriod } from "@/hooks/use-period";
import { sendEmail } from "@/actions/send-email";

type RequestType = inferProcedureInput<AppRouter["task"]["startWorkflow"]>;

export const useStartWorkflowMerit = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { period } = usePeriod();

  const startWorkflow = useMutation(trpc.task.startWorkflow.mutationOptions());

  const mutation = (value: RequestType) => {
    toast.loading("Starting workflow...", { id: "start-workflow-merit" });

    startWorkflow.mutate(
      { ...value },
      {
        onSuccess: async (data) => {
          queryClient.invalidateQueries(
            trpc.kpiMerit.getByFormId.queryOptions({ id, period }),
          );

          toast.success("Workflow started!", { id: "start-workflow-merit" });

          const recipientEmail = "pondpopza5@gmail.com";

          await sendEmail({
            to: "weerawat.m@somboon.co.th",
            subject: "Workflow Started",
            description: "Your workflow has been started. Please check it out.",
            url: `${process.env.NEXT_PUBLIC_APP_URL}/performance/merit/${data.id}?period=${period}`,
          });
        },
        onError: (ctx) => {
          toast.error(ctx.message || "Something went wrong", {
            id: "start-workflow-merit",
          });
        },
      },
    );
  };

  return { mutation, opt: startWorkflow };
};
