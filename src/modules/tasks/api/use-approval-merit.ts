import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { usePeriod } from "@/hooks/use-period";
import { sendEmail } from "@/actions/send-email";
import { isFormatEmail } from "../type";

type RequestType = inferProcedureInput<AppRouter["task"]["confirmation"]>;

export const useApprovalMerit = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { period } = usePeriod();

  const confirmation = useMutation(trpc.task.confirmation.mutationOptions());

  const mutation = (value: RequestType) => {
    toast.loading("Confirming workflow...", { id: "approval" });

    confirmation.mutate(
      { ...value },
      {
        onSuccess: async (data) => {
          queryClient.invalidateQueries(
            trpc.kpiMerit.getByFormId.queryOptions({ id, period }),
          );

          toast.success(
            value.confirm ? "Workflow Approved!" : "Workflow Rejected!",
            { id: "approval" },
          );

          if (
            process.env.NODE_ENV === "production" && 
            Array.isArray(data.emails) && 
            data.emails.some(email => email && isFormatEmail.includes(email))
          ) {
            for (const email of data.emails) {
              if (email && isFormatEmail.includes(email)) {
                await sendEmail({
                  to: email,
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
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/performance/merit/${id}?period=${period}`,
                });
              }
            }
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
