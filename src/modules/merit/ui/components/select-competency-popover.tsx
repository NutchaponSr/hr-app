"use client";

import { Command } from "cmdk";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { Competency, CompetencyType } from "@/generated/prisma";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Props {
  perform: boolean;
  types: CompetencyType[];
  onSelect?: (competency: Competency) => void;
  selectedCompetencyId?: string;
  value: string;
}

export const SelectCompetencyPopover = ({ value, types, perform, onSelect, selectedCompetencyId }: Props) => {
  const trpc = useTRPC();

  const [isOpen, setIsOpen] = useState(false);

  const { data: competencies } = useQuery(trpc.competency.getMany.queryOptions({ types }));

  return (
    <Popover modal open={isOpen && perform} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button type="button">
          {competencies?.find(f => f.id === value)?.name || "Select"}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        align="start" 
        side="bottom" 
        className="w-[400px] p-0" 
        sideOffset={0}
      >
        <Command>
          {/* Search Input */}
          <div className="flex items-center gap-2 w-full px-2 py-2">
            <Command.Input
              placeholder="Search competencies..."
              className="focus-visible:border-marine focus-visible:ring-marine/40 focus-visible:ring-[2.5px] focus-visible:outline-none rounded px-2.5 w-full shadow-[0_0_0_1.25px_rgba(15,15,15,0.1)] bg-[#f2f1ee99] text-sm relative leading-5 flex items-center h-7 py-0.5 text-primary placeholder:text-foreground"
            />
          </div>

      
          <div className="max-h-[320px] min-h-0 grow z-[1] overflow-x-hidden overflow-y-auto mx-0 mb-0">
            <div className="flex flex-col gap-px relative p-1">
              <Command.List>
                <Command.Empty className="flex flex-col gap-2 p-2">
                  <div className="mx-1 text-xs text-tertiary font-medium">
                    No competencies found
                  </div>
                </Command.Empty>

                {competencies && (
                  <Command.Group className="flex flex-col gap-px">
                    {competencies.map((competency) => (
                      <Command.Item 
                        key={competency.id} 
                        value={`${competency.name} ${competency.definition}`}
                        onSelect={() => {
                          onSelect?.(competency);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex rounded w-full cursor-pointer transition data-[selected=true]:bg-primary/6",
                          selectedCompetencyId === competency.id && "bg-primary/6",
                        )}
                      >
                        <div className="flex items-center gap-2 w-full select-none min-h-7 text-sm px-2 py-1">
                          <div className="grow shrink basis-auto min-w-0">
                            <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                              <div className="flex flex-row items-center">
                                <div className="whitespace-nowrap overflow-hidden text-ellipsis text-primary font-medium">
                                  {competency.name}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
            </div>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};