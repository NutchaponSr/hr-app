"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { useYear } from "@/hooks/use-year";

import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { convertAmountFromUnit } from "@/lib/utils";

interface Props {
  id: string;
  width: string;
  value: number | null;
}

export const WeightInput = ({ id, value, width }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { year } = useYear();

  const [weight, setWeight] = useState(convertAmountFromUnit(value, 2));

  const update = useMutation(trpc.kpiBonus.update.mutationOptions());

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open && weight !== value) {
          update.mutate({ id, weight }, {
            onSuccess: () => {
              queryClient.invalidateQueries(
                trpc.kpiBonus.getByEmployeeId.queryOptions({ year }),
              );
            },
          });
        }
      }}
    >
      <PopoverTrigger asChild>
        <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
          <div className="whitespace-nowrap text-end break-normal">
            <div className="leading-[1.5] whitespace-nowrap break-normal inline font-normal me-1 text-sm text-primary">
              {weight && Number(weight).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width }} sideOffset={-37}>
        <input
          type="number"
          value={String(weight)}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full focus-visible:outline-none h-9 px-2 text-sm text-primary"
        />
      </PopoverContent>
    </Popover>
  );
};
