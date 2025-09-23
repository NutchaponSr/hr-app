"use client";

import { Command } from "cmdk";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDownIcon } from "lucide-react";

import { 
  FormControl,
  FormField, 
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { MeritSchema } from "../../schema";
import { CompetencyType } from "@/generated/prisma";
import { useTRPC } from "@/trpc/client";
import { CommandSearch } from "@/components/command-search";
import { cn } from "@/lib/utils";

interface Props {
  index: number;
  label: string;
  types: CompetencyType[];
  canPerform: boolean;
  form: UseFormReturn<MeritSchema>;
}

export const CompetencyItem = ({
  form,
  label,
  index,
  types,
  canPerform
}: Props) => {
  const trpc = useTRPC();

  const { data: competencyQuery } = useQuery(trpc.competency.getMany.queryOptions({ types }));

  const competencies = competencyQuery || [];

  return (
    <div className="flex flex-col gap-1.5">
      <FormField 
        control={form.control}
        name={`competencies.${index}.competencyId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <CommandSearch
                className="w-100 p-2"
                trigger={
                  <div
                    role="button"
                    data-perform={canPerform}
                    className="border-[1.25px] border-border rounded hover:bg-primary/6 px-2 py-1 gap-2 text-primary whitespace-nowrap text-ellipsis overflow-hidden flex items-center justify-between data-[perform=true]:opacity-60 data-[perform=true]:pointer-events-none"
                  >
                    <div className="whitespace-nowrap text-ellipsis overflow-hidden">
                      {competencies.find((f) => f.id === field.value)?.name || "Empty"}
                    </div>
                    <ChevronsUpDownIcon className="size-3.5 text-tertiary shrink-0" />
                  </div>
                }
              >
                <Command.Group>
                  {competencies?.map((c) => (
                    <Command.Item 
                      key={c.id}
                      onSelect={() => field.onChange(c.id)}
                      className={cn(
                        "flex rounded w-full cursor-pointer transition data-[selected=true]:bg-primary/6",
                        field.value === c.id && "bg-primary/6",
                      )}
                    >
                      <div className="flex items-center gap-2 w-full select-none min-h-7 text-sm px-2 py-1">
                        <div className="grow shrink basis-auto min-w-0">
                          <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                            <div className="flex flex-row items-center">
                              <div className="whitespace-nowrap overflow-hidden text-ellipsis text-primary font-medium">
                                {c.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              </CommandSearch>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-col gap-1">
        <div className="text-secondary text-xs">Description</div>
        <p className="text-xs text-primary leading-4 whitespace-break-spaces text-ellipsis overflow-hidden">
          {competencies.find((f) => f.id === form.getValues(`competencies.${index}.competencyId`))?.definition || "Empty"}
        </p>
      </div>
    </div>
  );
}