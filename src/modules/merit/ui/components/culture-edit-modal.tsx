import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Culture, CultureRecord } from "@/generated/prisma";

import {
  Dialog,
  DialogContent,
  DialogHidden,
  DialogTrigger
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { RowField } from "@/components/row-field";

import { useMeritId } from "@/modules/merit/hooks/use-merit-id";

import { cultureRecordSchema, CultureRecordSchema } from "@/modules/merit/schema";
import { ColumnData } from "@/components/column-data";
import { convertAmountFromUnit } from "@/lib/utils";
import { renderBelief } from "./render-belief";

interface Props {
  children: React.ReactNode;
  culture: CultureRecord & { culture: Culture | null; weight: number };
}

export const CultureEditModal = ({ children, culture }: Props) => {
  const trpc = useTRPC();
  const meritId = useMeritId();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const updateCulture = useMutation(trpc.kpiMerit.updateCulture.mutationOptions());

  const defaultValues = {
    evdience: culture.evidence ?? "",
  } as const;

  const form = useForm<CultureRecordSchema>({
    resolver: zodResolver(cultureRecordSchema),
    defaultValues,
  });

  const onSubmit = (value: CultureRecordSchema) => {
    toast.loading("updating...", { id: "culture-update" });
    updateCulture.mutate({
      id: culture.id,
      cultureRecordSchema: value,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getById.queryOptions({ id: meritId }))
        toast.success("Updated!", { id: "culture-update" });
        setOpen(false);
        form.reset(defaultValues);
      },
      onError: (ctx) => {
        toast.error(ctx.message, { id: "culture-update" });
      },
    });
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset(defaultValues);
    }
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
                  <div className="w-full h-16 flex" />
                  <h2 className="max-w-full w-fit whitespace-break-spaces break-all text-3xl font-bold resize-none text-primary overflow-hidden text-start">
                    {culture.culture?.name}
                  </h2>
                  <div className="max-w-full overflow-hidden mb-3">
                    <p className="max-w-full whitespace-break-spaces break-all text-primary text-sm py-1">
                      {culture.culture?.description}
                    </p>
                  </div>
                  <h4 className="py-0.5 text-sm leading-[18px] flex flex-row items-center font-medium gap-0.5 ms-1.5 text-tertiary">
                    Belief
                  </h4>
                  <div className="mt-2">
                    {renderBelief(culture.culture?.belief)}
                  </div>
                </div>
                
                <div className="col-start-2 col-end-2 min-w-0 mb-3 -ms-1 pb-3">
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] w-full gap-y-2 gap-x-1">
                    <ColumnData header="Weight">
                      {Number(convertAmountFromUnit(culture.weight || 0, 2)).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })} %
                    </ColumnData>
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
                        name="evdience"
                        label="Evidence"
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