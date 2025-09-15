import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { convertAmountFromUnit } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { Competency, CompetencyRecord } from "@/generated/prisma";

import {
  Dialog,
  DialogContent,
  DialogHidden,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { RowField } from "@/components/row-field";
import { ColumnData } from "@/components/column-data";
import { ColumnField } from "@/components/column-field";

import { SelectCompetencyPopover } from "@/modules/merit/ui/components/select-competency-popover";

import { useMeritId } from "@/modules/merit/hooks/use-merit-id";

import { competencyRecordSchema, CompetencyRecordSchema } from "@/modules/merit/schema";

interface Props {
  children: React.ReactNode;
  competency: CompetencyRecord & { competency: Competency | null };
}

export const CompetencyEditModal = ({ children, competency }: Props) => {
  const trpc = useTRPC();
  const meritId = useMeritId();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(competency.competency);

  const updateCompetency = useMutation(trpc.kpiMerit.updateCompetency.mutationOptions());

  const defaultValues = {
    competencyId: competency.competencyId ?? "",
    expectedLevel: competency.expectedLevel ?? "",
    weight: String(convertAmountFromUnit(competency.weight, 2)),
    input: competency.input ?? "",
    output: competency.output ?? "",
  }

  useEffect(() => {
    setSelectedCompetency(competency.competency);
  }, [competency.competency]);

  const form = useForm<CompetencyRecordSchema>({
    resolver: zodResolver(competencyRecordSchema),
    defaultValues,
  });

  const handleCompetencySelect = (newCompetency: Competency) => {
    setSelectedCompetency(newCompetency);
    form.setValue("competencyId", newCompetency.id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = (value: CompetencyRecordSchema) => {
    toast.loading("updating...", { id: "competency-update" });
    updateCompetency.mutate({
      id: competency.id,
      competencyRecordSchema: value,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getById.queryOptions({ id: meritId }))
        toast.success("Updated!", { id: "competency-update" });
        setOpen(false);
        form.reset(defaultValues);
      },
      onError: (ctx) => {
        toast.error(ctx.message, { id: "competency-update" });
      },
    });
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    setSelectedCompetency(competency.competency);
    form.reset(defaultValues);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="h-[calc(100%-144px)] max-w-5xl">
        <DialogHidden />
        <ScrollArea className="flex flex-col grow relative overflow-x-hidden overflow-y-auto me-0 mb-0">
          <div className="w-full flex flex-col relative items-center grow">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-[126px_1fr_126px] w-full pb-[120px]">
                <div className="col-start-2 col-end-2 min-w-0 mb-3 -ms-1 pb-3">
                  <div className="w-full flex flex-col items-center shrink-0 grow-0">
                    <div className="w-full h-16 flex" />
                    <FormField
                      control={form.control}
                      name="competencyId"
                      render={({ field }) => (
                        <FormItem className="w-full gap-0">
                          <FormControl>
                            <SelectCompetencyPopover
                              id="competency-select"
                              perform={true}
                              onSelect={handleCompetencySelect}
                              selectedCompetencyId={field.value ?? undefined}
                            >
                              <Button type="button" variant="outline" className="w-fit h-full">
                                <span data-value={!!selectedCompetency} className="max-w-full w-full whitespace-break-spaces break-all text-3xl font-bold resize-none field-sizing-content h-full focus-visible:outline-none data-[value=true]:text-primary text-tertiary overflow-hidden text-start">
                                  {selectedCompetency?.name || "Select competency"}
                                </span>

                                <div className="self-start mt-2">
                                  <ChevronsUpDownIcon className="size-5 text-neutral stroke-[1.75]" />
                                </div>
                              </Button>
                            </SelectCompetencyPopover>
                          </FormControl>
                          {selectedCompetency && (
                            <div className="max-w-full overflow-hidden">
                              <p className="max-w-full whitespace-break-spaces break-all text-primary text-sm px-1.5 py-1">
                                {selectedCompetency?.definition}
                              </p>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full h-4 flex" />
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] w-full gap-y-2 gap-x-1 mt-2.5">
                    <ColumnField 
                      form={form}
                      name="expectedLevel"
                      label="Expected PL"
                      variant="select"
                      options={Array.from({ length: 5 }).map((_, index) => ({ key: String(index + 1), label: `PL ${index + 1}` }))}
                    />
                  </div>
                  <div className="grid grid-cols-5 w-full gap-y-2 gap-x-1 mt-2.5">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const level = index + 1;
                      const isSelected = String(level) === String(form.watch("expectedLevel"));

                      return (
                        <ColumnData
                          key={level}
                          isSelected={isSelected}
                          header={`Level ${level}`}
                        >
                          {
                            (() => {
                              const value = competency.competency?.[`t${level}` as keyof Competency];
                              if (value instanceof Date) {
                                return value.toLocaleString();
                              }
                              return value || "Empty";
                            })()
                          }
                        </ColumnData>
                      );
                    })}
                  </div>
                </div>
                <div className="col-start-2 col-end-2 min-w-0 mb-3 -ms-1 pb-3">
                  <div className="flex flex-col gap-2">
                    <h4 className="py-0.5 text-xs leading-[18px] flex flex-row items-center font-medium gap-0.5 ms-1.5 text-tertiary">
                      Properties
                    </h4>

                    <div role="table" className="w-full max-w-full mx-auto flex flex-col gap-1.5">
                      <RowField
                        form={form}
                        name="weight"
                        label="Weight"
                        variant="numeric"
                      />
                      <RowField
                        form={form}
                        name="input"
                        label="Input"
                        variant="text"
                      />
                      <RowField
                        form={form}
                        name="output"
                        label="Output"
                        variant="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-start-2 col-end-2 min-w-0 mb-3 -ms-1 pb-3">
                  <Button type="submit" variant="secondary" size="md">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}