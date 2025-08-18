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

interface Props {
  id: string;
  width: string;
  value: string | null;
}

export const NameInput = ({ id, value, width }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { year } = useYear();

  const [name, setName] = useState(value || "");

  const update = useMutation(trpc.kpiBonus.update.mutationOptions());

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open && name !== value) {
          update.mutate({ id, name }, {
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
          <div className="flex items-start gap-px">
            <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
              {name}
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width }} sideOffset={-37}>
        <div className="p-2 min-h-[38px] flex flex-col justify-between grow text-sm">
          <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="break-all whitespace-break-spaces w-full resize-none focus-visible:outline-none field-sizing-content min-h-0 text-primary"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
