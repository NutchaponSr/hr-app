import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { inferProcedureInput } from "@trpc/server";
import { useMutation } from "@tanstack/react-query";

import { Task } from "@/generated/prisma";

import { useTRPC } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";

type RequestType = inferProcedureInput<AppRouter["kpiBonus"]["createForm"]>;

export const useCreateKpiForm = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const createForm = useMutation(trpc.kpiBonus.createForm.mutationOptions());

  const mutation = (value: RequestType, task?: Task) => {
    if (!task) {
      toast.loading("Creating KPI Form...", { id: "create-kpi-form" });
  
      createForm.mutate({ ...value }, {
        onSuccess: ({ id }) => {
          
          toast.success("KPI form created!", { id: "create-kpi-form" });
          router.push(`/performance/bonus/${id}?period=${value.period}`);
        },
        onError: (ctx) => {
          toast.error(ctx.message || "Something went wrong", { id: "create-kpi-form" });
        },
      });
    } else {
      router.push(`/performance/bonus/${task.id}?period=${value.period}`);
    }
  }

  return { mutation, opt: createForm };
}