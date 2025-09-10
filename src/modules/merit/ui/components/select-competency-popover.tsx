"use client";

import { Command } from "cmdk";
import { BsFileEarmark } from "react-icons/bs";
import { ChevronDownIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

import { useTRPC } from "@/trpc/client";
import { competencyCatalog } from "@/types/competency";
import { Competency, CompetencyType } from "@/generated/prisma";
import { useYear } from "@/hooks/use-year";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SelectionBadge } from "@/components/selection-badge";
import { useParams } from "next/navigation";

interface Props {
  id: string;
  perform: boolean;
  children: React.ReactNode;
  onSelect?: (competency: Competency) => void;
  selectedCompetencyId?: string;
}

export const SelectCompetencyPopover = ({ id, perform, children, onSelect, selectedCompetencyId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string; }>();

  const { year } = useYear();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(null);

  const { data: competencies, isLoading } = useQuery(trpc.competency.getMany.queryOptions());


  return (
    <Popover modal open={isOpen && perform} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
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

          {/* Type Filter Dropdown */}
          {/* <div className="flex flex-row mx-2 my-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  data-active={!!selectedType} 
                  className="transition text-sm inline-flex items-center justify-center whitespace-nowrap rounded-4xl h-6 leading-6 px-2 data-[active=true]:bg-[#e8f2fa] data-[active=true]:text-marine text-tertiary hover:bg-primary/6"
                  disabled={updateCompetencyMutation.isPending}
                >
                  <BsFileEarmark className="size-4 stroke-[0.25] mr-1.5" />
                  {getTypeLabel()}
                  <ChevronDownIcon className="size-3 ml-1" />
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Select Type</DropdownMenuLabel>
                {Object.entries(competencyCatalog).map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleTypeSelect(key as CompetencyType)}
                    className="cursor-pointer"
                  >
                    <SelectionBadge {...value} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}

          {/* Competencies List */}
          <div className="max-h-[320px] min-h-0 grow z-[1] overflow-x-hidden overflow-y-auto mx-0 mb-0">
            <div className="flex flex-col gap-px relative p-1">
              <Command.List>
                <Command.Empty className="flex flex-col gap-2 p-2">
                  <div className="mx-1 text-xs text-tertiary font-medium">
                    No competencies found
                  </div>
                </Command.Empty>

                {competencies && (
                  <Command.Group>
                    {competencies.map((competency) => (
                      <Command.Item 
                        key={competency.id} 
                        value={`${competency.name} ${competency.definition}`}
                        onSelect={() => {
                          onSelect?.(competency);
                          setIsOpen(false);
                        }}
                        className={`hover:bg-primary/6 flex rounded w-full cursor-pointer transition data-[selected=true]:bg-primary/10 ${
                          selectedCompetencyId === competency.id ? 'bg-primary/10' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 w-full select-none min-h-[45px] text-sm px-2 py-1">
                          <div className="grow shrink basis-auto min-w-0">
                            <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                              <div className="flex flex-row items-center">
                                <div className="whitespace-nowrap overflow-hidden text-ellipsis text-primary font-medium">
                                  {competency.name}
                                </div>
                              </div>
                            </div>
                            
                            {competency.definition && (
                              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                                <div className="flex text-xs overflow-hidden">
                                  <div className="text-xs whitespace-nowrap overflow-hidden text-ellipsis text-tertiary">
                                    {competency.definition}
                                  </div>
                                </div>
                              </div>
                            )}
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