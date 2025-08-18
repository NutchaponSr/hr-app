import { Strategy } from "@/generated/prisma";

import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { useMemo, useState } from "react";
import { SelectionBadge } from "@/components/selection-badge";
import { strategies } from "../../constants";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useYear } from "@/hooks/use-year";

interface Props {
  id: string;
  value: Strategy | null;
}

export const StrategyInput = ({ id, value }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { year } = useYear();

  const [search, setSearch] = useState("");
  const [strategy, setStrategy] = useState<Strategy | null>(value);

  const options = Object.entries(strategies).map(([key, value]) => ({
    key,
    label: value,
    onSelect: (key: Strategy) => setStrategy(key),
  }));

  const filteredOptions = useMemo(() => {
    return options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const update = useMutation(trpc.kpiBonus.update.mutationOptions());

  return (
    <Popover onOpenChange={(open) => {
      if (!open && strategy !== value) {
        update.mutate({
          id, strategy
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries(
              trpc.kpiBonus.getByEmployeeId.queryOptions({ year }),
            );
          },
        });
      }
    }}>
      <PopoverTrigger asChild>
        <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
          <div className="flex items-start gap-px">
            <div className="leading-[1.5] whitespace-nowrap break-normal inline me-1 text-sm text-primary">
              {strategy && <SelectionBadge label={strategies[strategy]} />}
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-[248px]" 
        align="start"
        sideOffset={-37}
      >
        <div className="flex flex-col min-w-[180px] max-w-[calc(-24px+100vw)] h-full max-h-[70vh]">
          <div className="shrink-0 max-h-60 shadow-[inset_0_-1.25px_rgba(55,53,47,0.16)] overflow-y-auto overflow-x-hidden">
            <div className="flex whitespace-nowrap items-start bg-[#f2f1ee99] overflow-auto text-sm min-h-7 p-1">
              <div className="flex flex-wrap grow py-1 px-2 gap-1.5">
                {strategy ? (
                  <SelectionBadge label={strategies[strategy]} onClick={() => {}} />
                ) : (
                  <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for an option..."
                    className="w-full focus-visible:outline-none h-5 text-primary placeholder:text-muted"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grow overflow-y-auto overflow-x-hidden">
          {filteredOptions.length > 0 ? (
            <div role="listbox" className="relative gap-px flex flex-col p-1">
              <div className="flex px-2 my-1.5 text-tertiary font-medium select-none text-xs">
                <h4 className="self-center whitespace-nowrap overflow-hidden text-ellipsis">
                  Select an option
                </h4>
              </div>
              <div className="m-0">
                {filteredOptions.map(({ key, label, onSelect }) => (
                  <div 
                    key={key}
                    role="option"
                    aria-selected={value === label}
                    onClick={() => onSelect(key as Strategy)}
                    className="flex transition w-full hover:bg-primary/6 rounded cursor-pointer"
                  > 
                    <div className="flex items-center gap-2 px-2 text-sm min-h-7 w-full">
                      <div className="flex-1">
                        <div className="inline-flex items-center shrink max-w-full min-w-0 h-5 rounded-xs px-1.5 leading-[120%] text-sm bg-gray-foreground text-gray-muted whitespace-nowrap overflow-hidden text-ellipsis">
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis inline-flex items-center h-5 leading-5">
                            {label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative p-1 flex flex-col">
              <div className="flex items-center gap-2 leading-[120%] w-full select-none py-1 px-2 mt-0.5 mb-1.5">
                <div className="whitespace-nowrap overflow-hidden text-ellipsis text-tertiary text-xs">
                  No Result
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}