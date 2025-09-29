import {  useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export const useGetKpiForm = (id: string) => {
  const trpc = useTRPC();

  const query = trpc.kpiBonus.getById.queryOptions({ id });

  const { data: kpiForm } = useSuspenseQuery({
    ...query,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return kpiForm;
}