import { useState } from "react";
import { IoTriangle } from "react-icons/io5";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { AutoResizeTextarea } from "@/components/auto-resize-textarea";
import { cn } from "@/lib/utils";
import { GoHash } from "react-icons/go";
import { useZodForm } from "@/hooks/use-zod-form";
import { kpiBonusSchema, type KpiBonusSchema } from "@/modules/performance/schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateSheetStore } from "@/modules/performance/store/use-create-sheet-store";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useYear } from "@/hooks/use-year";

const values = [100, 90, 80, 70] as const;

export const BonusCreateForm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  const { year } = useYear();
  const { data: session } = authClient.useSession();

  const { onClose } = useCreateSheetStore();

  const [openIndexs, setOpenIndexs] = useState<number[]>(values.map((_, index) => index));

  const { register, handleSubmit, watch, errors } = useZodForm<KpiBonusSchema, typeof kpiBonusSchema>(
    kpiBonusSchema,
    {
      name: "",
      weight: "",
      target: { 
        "100": "", 
        "90": "", 
        "80": "", 
        "70": "" 
      },
      definition: null,
    }
  );

  const createBonus = useMutation(trpc.kpiBonus.create.mutationOptions());

  const currentWeight = watch("weight");

  const toggleIndex = (index: number) => {
    setOpenIndexs((prev) => 
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  }

  const onSubmit = (value: KpiBonusSchema) => {
    const loadingToast = toast.loading("Creating KPI Bonus...");

    createBonus.mutate({ ...value }, {
      onSuccess: () => {
        toast.success("Bonus created successfully!", {
          id: loadingToast,
        });

        queryClient.invalidateQueries(trpc.kpiBonus.getByEmployeeId.queryOptions({
          employeeId: session!.user.employeeId,
          year,
        }))
        
        onClose();
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid [grid-template-columns:_[full-start]_76px_[content-start]_1fr_[content-end]_76px_[full-end]] w-full"
    >
      <div className="mb-3 pb-3 col-start-2">
        <div className="flex items-center leading-[1.2] text-sm font-medium max-w-full w-full whitespace-break-spaces break-words text-primary py-1">
          Create KPI Bonus
        </div>
        <div className="flex items-center leading-[1.2] text-2xl pt-1 font-bold max-w-full w-full text-primary">
          <AutoResizeTextarea
            {...register("name")}
            autoFocus 
            size="lg"
            placeholder="New KPI"
          />
        </div>
        {errors.name?.message && (
          <div className="text-destructive text-xs mt-1">{String(errors.name.message)}</div>
        )}
      </div>

      <div className="mt-2 col-start-2">
        <div className="flex flex-col gap-2">
          <div role="table">
            <div role="row" className="flex w-full relative mb-1">
              <div role="cell" className="flex items-center h-8 rounded max-w-40 w-40 px-1.5">
                <GoHash className="size-4 mr-1 text-tertiary" />
                <div className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-tertiary">
                  Weight
                </div>
              </div>
              <div role="cell" className="flex h-full flex-1 flex-col ms-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="transition hover:bg-primary/6 relative text-sm overflow-hidden inline-block rounded w-full h-8 py-1.5 px-2.5">
                      <div className="leading-5 break-words whitespace-pre-wrap text-foreground text-start">
                      {!currentWeight
                        ? "Empty" 
                        : `${Number(currentWeight).toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })} %`
                      }
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-49 p-0" sideOffset={-32}>
                    <input
                      type="number"
                      value={watch("weight")?.toString() ?? ""}
                      className="w-full focus-visible:outline-none h-8 px-2 text-sm text-primary"
                      {...register("weight")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {errors.weight?.message && (
              <div className="text-destructive text-xs mt-1">{String(errors.weight.message)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 col-start-2">
        <div className="max-w-full flex flex-col items-start leading-[1.5] w-full pt-2 min-h-60">
          <h3 className="font-semibold max-w-full w-full whitespace-break-spaces break-words text-primary text-[1.2em] leading-[1.3] my-px">
            Target
          </h3>
          {values.map((value, index) => {
            const isOpen = openIndexs.includes(index);

            return (
              <div key={value} className="w-full my-px pt-1.5 flex items-start text-primary">
                <div className="w-6 flex items-center justify-center me-0.5">
                  <Button 
                    variant="ghost" 
                    size="iconXs" 
                    type="button"
                    onClick={() => toggleIndex(index)}
                  >
                    <IoTriangle className={cn("size-3 rotate-90 text-tertiary transition-transform", isOpen && "rotate-180")} />
                  </Button>
                </div>
                <div className="flex-1">
                  <h4 className="text-primary p-0.5 font-medium">{value}</h4>
                  {isOpen && (
                    <AutoResizeTextarea
                      {...register((`target.${String(value)}` as unknown) as
                        | "target.100"
                        | "target.90"
                        | "target.80"
                        | "target.70")}
                    />
                  )}
                  {(() => {
                    const key = String(value) as "100" | "90" | "80" | "70";
                    const err = errors.target?.[key]?.message;
                    return err ? (
                      <div className="text-destructive text-xs mt-1">{String(err)}</div>
                    ) : null;
                  })()}
                </div>
              </div>
            );
          })}
          <div className="flex h-7.5 w-full" />
          <h3 className="font-semibold max-w-full w-full whitespace-break-spaces break-words text-primary text-[1.2em] leading-[1.3] my-px">
            Definition
          </h3>
          <AutoResizeTextarea {...register("definition")} />
        </div>
      </div>

      <div className="mt-6 pt-6 col-start-2">
        <div className="flex items-center justify-end">
          <Button size="lg" type="submit">
            Create KPI Bonus
          </Button>
        </div>
      </div>
    </form>
  );
}