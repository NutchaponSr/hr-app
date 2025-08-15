import { useState } from "react";
import { IoTriangle } from "react-icons/io5";

import { Button } from "@/components/ui/button";

import { AutoResizeTextarea } from "@/components/auto-resize-textarea";
import { cn } from "@/lib/utils";
import { useZodForm } from "@/hooks/use-zod-form";
import { kpiBonusSchema, type KpiBonusSchema } from "@/modules/performance/schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateSheetStore } from "@/modules/performance/store/use-create-sheet-store";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useYear } from "@/hooks/use-year";
import { projectTypes, strategies } from "../../constants";
import { Project, Strategy } from "@/generated/prisma";
import { FormFieldRow } from "@/components/form-field-row";

const values = [100, 90, 80, 70] as const;

export const BonusCreateForm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  const { year } = useYear();
  const { data: session } = authClient.useSession();

  const { onClose } = useCreateSheetStore();

  const [openIndexs, setOpenIndexs] = useState<number[]>(values.map((_, index) => index));

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    errors 
  } = useZodForm<KpiBonusSchema, typeof kpiBonusSchema>(
    kpiBonusSchema,
    {
      name: "",
      weight: "",
      objective: "",
      target: { 
        "100": "", 
        "90": "", 
        "80": "", 
        "70": "" 
      },
    }
  );

  const createBonus = useMutation(trpc.kpiBonus.create.mutationOptions());

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
            <FormFieldRow 
              variant="numeric" 
              label="Weight" 
              name="weight"
              register={register}
              watch={watch}
              errors={errors}
            />
            <FormFieldRow 
              variant="select" 
              label="Strategy" 
              name="strategy"
              register={register}
              watch={watch}
              errors={errors}
              value={strategies[watch("strategy")]}
              onClear={() => setValue("strategy", "" as Strategy)}
              options={Object.entries(strategies).map(([key, value]) => ({
                key,
                label: value,
                onSelect: (value) => setValue("strategy", value as Strategy, { shouldValidate: true }),
              }))}
            />
            <FormFieldRow 
              variant="text" 
              label="Objective" 
              name="objective"
              register={register}
              watch={watch}
              errors={errors}
            />
            <FormFieldRow 
              variant="select" 
              label="Type" 
              name="type"
              register={register}
              watch={watch}
              errors={errors}
              value={projectTypes[watch("type")]}
              onClear={() => setValue("type", "" as Project)}
              options={Object.entries(projectTypes).map(([key, value]) => ({
                key,
                label: value,
                onSelect: (value) => setValue("type", value as Project, { shouldValidate: true }),
              }))}
            />
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
        </div>
      </div>

      <div className="mt-6 pt-6 col-start-2">
        <div className="flex items-center justify-end">
          <Button size="lg" type="submit" disabled={createBonus.isPending}>
            Create KPI Bonus
          </Button>
        </div>
      </div>
    </form>
  );
}