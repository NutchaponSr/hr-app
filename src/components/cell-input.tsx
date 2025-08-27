"use client";

import { Controller, FieldPath, FieldValues, useForm } from "react-hook-form";

import { CompetencyItem, CultureItem, Kpi } from "@/generated/prisma";
import { InputVariants } from "@/types/inputs";
import { useCallback, useState } from "react";
import { FieldInput } from "./field-input";
import { useElementHeight } from "@/hooks/use-height";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useYear } from "@/hooks/use-year";

type SupportedModels = "kpi" | "competency" | "culture";

type ModelFieldMap = {
  kpi: keyof Kpi;
  competency: keyof CompetencyItem;
  culture: keyof CultureItem;
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
  const formContext = useForm({
    defaultValues: {
      [name]: data,
    }
  });
  const queryClient = useQueryClient();

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
    ...trpc.kpiBonus.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.kpiBonus.getInfo.queryOptions({ year }));
    },
  });

  const competencyMutation = useMutation({
    ...trpc.kpiMerit.updateCompetency.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.kpiMerit.getOne.queryOptions({ year }));
    },
  });

  const cultureMutation = useMutation({
    ...trpc.kpiMerit.updateCulture.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.kpiMerit.getOne.queryOptions({ year }));
    },
  });

  const updateMutation = modelType === "kpi" ? kpiMutation : modelType === "competency" ? competencyMutation : cultureMutation;

  const getDisplayValue = useCallback((value: string) => {
    if (variant === "select" && options) {
      const option = options.find(opt => opt.label === value);
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

