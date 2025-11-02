import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { inferProcedureInput } from "@trpc/server";
import { useMutation } from "@tanstack/react-query";

import { Task } from "@/generated/prisma";

import { useTRPC } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";

type RequestType = inferProcedureInput<AppRouter["kpiMerit"]["createForm"]>;

export const useCreateMeritForm = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const createForm = useMutation(trpc.kpiMerit.createForm.mutationOptions());

  const mutation = (value: RequestType, task?: Task) => {
    if (!task) {
      toast.loading("Creating merit form...", { id: "create-merit-form" });
  
      createForm.mutate({ ...value }, {
        onSuccess: ({ id }) => {
          toast.success("merit form created!", { id: "create-merit-form" });
          router.push(`/performance/merit/${id}?period=${value.period}`);
        },
        onError: (ctx) => {
          toast.error(ctx.message || "Something went wrong", { id: "create-merit-form" });
        },
      });
    } else {
      router.push(`/performance/merit/${task.id}?period=${value.period}`);
    }
  }

  return { mutation, opt: createForm };
}