import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { usePeriod } from "@/hooks/use-period";
import { sendEmail } from "@/actions/send-email";

type RequestType = inferProcedureInput<AppRouter["task"]["startWorkflow"]>;

export const useStartWorkflowKpi = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { period } = usePeriod();

  const startWorkflow = useMutation(trpc.task.startWorkflow.mutationOptions());

  const mutation = (value: RequestType) => {
    toast.loading("Starting workflow...", { id: "start-workflow-kpi" });

    startWorkflow.mutate(
      { ...value },
      {
        onSuccess: async (data) => {
          queryClient.invalidateQueries(
            trpc.kpiBonus.getById.queryOptions({ id, period }),
          );

          toast.success("Workflow started!", { id: "start-workflow-kpi" });

          const recipientEmail = "pondpopza5@gmail.com";

          if (recipientEmail) {
            await sendEmail({
              to: process.env.IMPLEMENT_EMAIL! || recipientEmail,
              subject: "Workflow Started",
              description: "Your workflow has been started. Please check it out.",
              url: `${process.env.NEXT_PUBLIC_APP_URL}/performance/bonus/${data.id}?period=${period}`,
            });
          }
        },
        onError: (ctx) => {
          toast.error(ctx.message || "Something went wrong", {
            id: "start-workflow-kpi",
          });
        },
      },
    );
  };

  return { mutation, opt: startWorkflow };
};
