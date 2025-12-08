import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { usePeriod } from "@/hooks/use-period";
import { sendReject } from "@/actions/send-reject";
import { sendPending } from "@/actions/send-pending";
import { sendApproved } from "@/actions/send-approved";

type RequestType = inferProcedureInput<AppRouter["task"]["confirmation"]>;

export const useApprovalMerit = (id: string) => {
  const trpc = useTRPC();
  const router = useRouter();
  
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

          if (!!data.owner.email && !!data.approver.email && process.env.NODE_ENV === "production") {

            if (data.isApproved) {
              await sendApproved({
                to: data.owner.email,
                cc: [data.checker?.email || "", data.approver?.email],
                subject: `[E-PMS] Completed: แจ้งผลการอนุมัติเอกสาร ${data.app} - ${data.owner.name}`,
                checkerName: data.checker.name,
                employeeName: data.owner.name,
                approverName: data.approver.name, 
                documentType: data.app,
                checkedAt: data.checkedAt ? format(data.checkedAt, "yyyy-MM-dd") : undefined,
                approvedAt: data.approvedAt ? format(data.approvedAt, "yyyy-MM-dd") : undefined,
                url: `${process.env.NEXT_PUBLIC_APP_URL}/performance/merit/${id}?period=${period}`,
              });
            } else {
              if (value.confirm) {
                await sendPending({
                  to: data.approver.email,
                  cc: [data.checker.email || "", data.owner.email],
                  subject: `[E-PMS] Action Required: ตรวจสอบและอนุมัติเอกสารจากระบบประเมินการปฏิบัติงาน (Final Approve) - ${data.owner.name}`,
                  checkerName: data.checker.name,
                  employeeName: data.owner.name,
                  approverName: data.approver.name,
                  documentType: data.app,
                  checkedAt: data.checkedAt ? format(data.checkedAt, "yyyy-MM-dd") : undefined,
                  status: data.status,
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/performance/merit/${id}?period=${period}`,
                });
              } else {
                await sendReject({
                  to: data.owner.email,
                  cc: [data.checker.email || data.approver.email],
                  subject: `[E-PMS] Action Required: แจ้งแก้ไขข้อมูล (Declined by Checker) - ${data.app}`,
                  checkerName: data.checker.name,
                  employeeName: data.owner.name,
                  approverName: data.approver.name,
                  documentType: data.app,
                  checkedAt: data.checkedAt ? format(data.checkedAt, "yyyy-MM-dd") : undefined,
                  status: data.status,
                  checkedBy: data.checkedBy,
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/performance/merit/${id}?period=${period}`,
                });
              }
            }
          }

          router.push("/performance");
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
