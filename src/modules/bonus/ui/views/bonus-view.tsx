"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  year: number;
  employeeId: string;
}

export const BonusView = ({ ...props }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.kpiBonus.getByEmployeeId.queryOptions({ ...props }));

  return (
    <pre className="text-sm text-primary">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}