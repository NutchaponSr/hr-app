import {  useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Period } from "@/generated/prisma";

export const useGetKpiForm = (id: string, period: Period) => {
  const trpc = useTRPC();

  const query = trpc.kpiBonus.getById.queryOptions({ id, period });

  const { data: kpiForm } = useSuspenseQuery({
    ...query,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return kpiForm;
}