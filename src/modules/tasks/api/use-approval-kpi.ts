import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { useSave } from "@/hooks/use-save";
import { usePeriod } from "@/hooks/use-period";
import { sendEmail } from "@/actions/send-email";

type RequestType = inferProcedureInput<AppRouter["task"]["confirmation"]>;

export const useApprovalKpi = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { setSave } = useSave();
  const { period } = usePeriod();

  const confirmation = useMutation(trpc.task.confirmation.mutationOptions());

  const mutation = (value: RequestType) => {
    toast.loading("Confirming workflow...", { id: "approval" });

    confirmation.mutate(
      { ...value },
      {
        onSuccess: async (data) => {
          queryClient.invalidateQueries(
            trpc.kpiBonus.getById.queryOptions({ id, period }),
          );

          toast.success(
            value.confirm ? "Workflow Approved!" : "Workflow Rejected!",
            { id: "approval" },
          );
          setSave(false);

          const recipientEmail = "pondpopza5@gmail.com";

          if (process.env.NODE_ENV === "production") {
            await sendEmail({
              to: "weerawat.m@somboon.co.th",
              subject: data.isApproved
                ? "Workflow Finished!"
                : value.confirm
                  ? "Workflow Approved!"
                  : "Workflow Rejected!",
              description: data.isApproved
                ? "Your workflow has been finished. Please check it out."
                : value.confirm
                  ? "Your workflow has been approved. Please check it out."
                  : "Your workflow has been rejected. Please check it out.",
              url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-in`,
            });
          }

        },
        onError: (ctx) => {
          toast.error(ctx.message || "Something went wrong", {
            id: "approval",
          });
        },
      },
    );
  };

  return { mutation, opt: confirmation };
};
