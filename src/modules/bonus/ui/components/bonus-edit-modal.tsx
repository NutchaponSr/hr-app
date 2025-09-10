import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { convertAmountFromUnit } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { Kpi } from "@/generated/prisma";

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
  FormItem
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { RowField } from "@/components/row-field";
import { ColumnField } from "@/components/column-field";


import { kpiCategoies, projectTypes } from "@/modules/bonus/constants";
import { kpiBonusCreateSchema, KpiBonusCreateSchema } from "@/modules/bonus/schema";

interface Props {
  kpi: Kpi;
  children: React.ReactNode;
}

export const BonusEditModal = ({ kpi, children }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<KpiBonusCreateSchema>({
    resolver: zodResolver(kpiBonusCreateSchema),
    defaultValues: {
      name: kpi.name,
      category: kpi.category,
      strategy: kpi.strategy,
      objective: kpi.definition,
      definition: kpi.definition,
      type: kpi.type,
      weight: String(convertAmountFromUnit(kpi.weight, 2)),
      target70: kpi.target70,
      target80: kpi.target80,
      target90: kpi.target90,
      target100: kpi.target100,
    }
  });

  const updateKpi = useMutation(trpc.kpiBonus.updateKpi.mutationOptions());

  const onSubmit = (value: KpiBonusCreateSchema) => {
    updateKpi.mutate({
      id: kpi.id,
      kpiBonusCreateSchema: value,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id: kpi.kpiFormId }));
      }
    });
  }

  return (
    <Dialog>
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
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <textarea
                              rows={1}
                              autoFocus
                              placeholder="New Kpi"
                              className="max-w-full w-full whitespace-break-spaces break-words text-4xl font-bold resize-none field-sizing-content h-full focus-visible:outline-none text-primary !placeholder:text-tertiary overflow-hidden"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] w-full gap-y-2 gap-x-1 mt-2.5">
                      <ColumnField
                        form={form}
                        name="category"
                        label="Category"
                        variant="select"
                        options={Object.entries(kpiCategoies).map(([key, label]) => ({ key, label }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-start-2 col-end-2 min-w-0 mb-3 -ms-1 pb-3">
                  <div className="flex flex-col gap-2">
                    <h4 className="py-0.5 text-xs leading-[18px] flex flex-row items-center font-medium gap-0.5 ms-1.5 text-tertiary">
                      Properties
                    </h4>

                    <div role="table" className="w-full max-w-full mx-auto">
                      <RowField
                        form={form}
                        name="strategy"
                        label="Link to strategy"
                        variant="text"
                      />
                      <RowField
                        form={form}
                        name="objective"
                        label="Objective"
                        variant="text"
                      />
                      <RowField
                        form={form}
                        name="type"
                        label="Type"
                        options={Object.entries(projectTypes).map(([key, label]) => ({ key, label }))}
                        variant="select"
                      />
                      <RowField
                        form={form}
                        name="weight"
                        label="Weight"
                        variant="numeric"
                      />
                      <RowField
                        form={form}
                        name="definition"
                        label="Measure (Unit / Method)"
                        variant="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-start-2 col-end-2 min-w-0 mb-3 -ms-1 pb-3">
                  <div className="flex flex-col gap-2">
                    <h4 className="py-0.5 text-xs leading-[18px] flex flex-row items-center font-medium gap-0.5 ms-1.5 text-tertiary">
                      Target
                    </h4>

                    <div role="table" className="w-full max-w-full mx-auto">
                      <RowField
                        form={form}
                        name="target70"
                        label="<  70%"
                        variant="text"
                      />
                      <RowField
                        form={form}
                        name="target80"
                        label="80%"
                        variant="text"
                      />
                      <RowField
                        form={form}
                        name="target90"
                        label="90%"
                        variant="text"
                      />
                      <RowField
                        form={form}
                        name="target100"
                        label="100%"
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