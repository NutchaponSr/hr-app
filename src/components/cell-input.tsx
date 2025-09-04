"use client";

import { Controller, FieldPath, FieldValues, useForm } from "react-hook-form";

import { CompetencyRecord, Kpi } from "@/generated/prisma";
import { InputVariants } from "@/types/inputs";
import { useCallback, useState } from "react";
import { FieldInput } from "./field-input";
import { useElementHeight } from "@/hooks/use-height";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useYear } from "@/hooks/use-year";
import { useParams } from "next/navigation";

type SupportedModels = "kpi" | "competency";

type ModelFieldMap = {
  kpi: keyof Kpi;
  competency: keyof CompetencyRecord;
}

interface Props<TFieldValues extends FieldValues, T extends SupportedModels> {
  id: string;
  name: FieldPath<TFieldValues>;
  perform: boolean;
  variant: Exclude<InputVariants, "action">;
  fieldName: ModelFieldMap[T];
  modelType: T;
  width?: string;
  options?: Array<{
    key: string;
    label: string;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  children: (displayValue: string) => React.ReactNode;
  disabled?: boolean;
}

export const CellInput = <TFieldValues extends FieldValues, T extends SupportedModels>({
  id,
  name,
  perform,
  variant,
  width,
  children,
  fieldName,
  modelType,
  options,
  data,
}: Props<TFieldValues, T>) => {
  const trpc = useTRPC();
  const params = useParams<{ id: string; }>();
  const queryClient = useQueryClient();
  const formContext = useForm({
    defaultValues: {
      [name]: data,
    }
  });

  const { year } = useYear();

  const {
    ref,
    height,
  } = useElementHeight({
    debounceMs: 50,
    includeMargin: true
  });

  const [isOpen, setIsOpen] = useState(false);

  const kpiMutation = useMutation({
    ...trpc.kpiBonus.updateKpi.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.kpiBonus.getInfo.queryOptions({ year }));
      queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id: params.id }));
    },
  });

  const competencyMutation = useMutation({
    ...trpc.kpiMerit.updateCompetency.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.kpiMerit.getInfo.queryOptions({ year }));
      queryClient.invalidateQueries(trpc.kpiMerit.getById.queryOptions({ id: params.id }));
    },
  });

  const updateMutation = modelType === "kpi" ? kpiMutation : competencyMutation;

  const getDisplayValue = useCallback((value: string) => {
    if (variant === "select" && options) {
      const option = options.find(opt => opt.key === value) ?? options.find(opt => opt.label === value);
      return option?.label || value;
    }

    return value || "";
  }, [options, variant]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = useCallback(async (value: any) => {
    try {
      const mutationData = {
        id,
        [fieldName]: value
      };

      await updateMutation.mutateAsync(mutationData);

    } catch (error) {
      console.error(`Failed to update ${modelType}:`, error);
    }
  }, [id, fieldName, modelType, updateMutation]);

  const {
    control,
    register,
  } = formContext;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const displayValue = getDisplayValue(value);

        return (
          <FieldInput
            variant={variant}
            value={value}
            height={height}
            width={width}
            register={register(name)}
            onOpenChange={(open) => {
              setIsOpen((prev) => !prev);

              if (!open && value !== data) {
                handleSave(value);
              }
            }}
            open={isOpen && perform}
            onChange={onChange}
            options={options}
          >
            <div
              ref={ref}
              role="button"
              className="select-none transition cursor-pointer relative flex text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap min-h-9 p-2 items-start justify-start"
            >
              {children(displayValue)}
            </div>
          </FieldInput>
        );
      }}
    />
  );
}

