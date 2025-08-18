import { useState, useMemo, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Kpi, Strategy, Project } from "@/generated/prisma";
import { InputVariants } from "@/types/inputs";
import { RowInput } from "@/components/cell-input";
import { useTRPC } from "@/trpc/client";
import { useYear } from "@/hooks/use-year";
import toast from "react-hot-toast";
import { FIELD_PROCESSORS, SelectOption } from "../../constants";

interface Props {
  id: string;
  data: unknown;
  variant: InputVariants;
  fieldName: keyof Kpi;
  width?: string;
  options?: SelectOption[];
  children: (displayValue: string) => React.ReactNode;
}

type KpiFieldValue = string | number | Strategy | Project | null;

export const BonusCellInput = ({
  id,
  data,
  variant,
  width,
  children,
  fieldName,
  options,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { year } = useYear();

  const initialValue = useMemo(() => {
    const stringValue = String(data || "");
    
    if (variant === "select" && options && stringValue) {
      const option = options.find(opt => opt.label === stringValue);
      return option ? option.key : stringValue;
    }
    
    return stringValue;
  }, [data, variant, options]);

  const [value, setValue] = useState(initialValue);

  const updateMutation = useMutation(trpc.kpiBonus.update.mutationOptions());

  const displayValue = useMemo(() => {
    if (variant === "select" && options && value) {
      const option = options.find(opt => opt.key === value);
      return option?.label || value;
    }
    return value;
  }, [variant, options, value]);

  const processFieldValue = useCallback((fieldName: keyof Kpi, rawValue: string): KpiFieldValue => {
    try {
      const processor = FIELD_PROCESSORS[fieldName as keyof typeof FIELD_PROCESSORS];
      
      if (!processor) {
        return rawValue.trim() || null;
      }
      
      if (variant === "select") {
        return processor(rawValue, options);
      }
      
      return processor(rawValue);
      
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message ?? "Invalid input");
      }
      
      throw error;
    }
  }, [options, variant]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setValue("");
  }, []);

  const handleSelect = useCallback((selectedValue: string) => {
    setValue(selectedValue);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (open || value === String(data || "")) return;

    try {
      const processedValue = processFieldValue(fieldName, value);
      
      const updatePayload = {
        id,
        [fieldName]: processedValue,
      };

      updateMutation.mutate(updatePayload, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.kpiBonus.getByEmployeeId.queryOptions({ year })
          );
          
        },
        onError: (error) => {
          console.error('Update failed:', error);
          
          setValue(String(data || ""));
          
          const errorMessage = error instanceof Error 
            ? error.message 
            : "Failed to update. Please try again.";
            
          toast.error(errorMessage);
        },
      });
      
    } catch {
      setValue(String(data || ""));
    }
  }, [
    value,
    data,
    fieldName,
    id,
    processFieldValue,
    updateMutation,
    queryClient,
    trpc.kpiBonus.getByEmployeeId,
    year,
  ]);

  return (
    <RowInput
      variant={variant}
      value={value}
      onChange={handleInputChange}
      options={options}
      onClear={handleClear}
      onOpenChange={handleOpenChange}
      onSelect={handleSelect}
      width={width}
    >
      {children(displayValue)}
    </RowInput>
  );
};