import { RowInput } from "@/components/cell-input";
import { CompetencyItem } from "@/generated/prisma";
import { useYear } from "@/hooks/use-year";
import { FIELD_PROCESSORS } from "@/modules/bonus/constants";
import { useTRPC } from "@/trpc/client";
import { InputVariants } from "@/types/inputs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useElementHeight } from "@/hooks/use-height";

interface Props {
  id: string;
  data: unknown;
  variant: InputVariants;
  fieldName: keyof CompetencyItem;
  width?: string;
  children: (displayValue: string) => React.ReactNode;
}

type KpiFieldValue = string | number | null;

export const CompetencyCellInput = ({
  id,
  data,
  width,
  fieldName,
  variant,
  children
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { year } = useYear();

  // Use ref to track if we're in the middle of an update
  const isUpdatingRef = useRef(false);

  // Use custom hook to measure children height
  const { ref: childrenRef, height: childrenHeight } = useElementHeight({
    debounceMs: 50,
    includeMargin: true
  });

  // Memoize initial value conversion
  const initialValue = useMemo(() => {
    return String(data ?? "");
  }, [data]);

  const [value, setValue] = useState(initialValue);

  // Sync local state with prop changes, avoiding infinite loops
  useEffect(() => {
    if (!isUpdatingRef.current) {
      const newStringValue = String(data ?? "");
      setValue(prev => prev !== newStringValue ? newStringValue : prev);
    }
  }, [data]);

  // Memoize the mutation to prevent unnecessary re-creations
  const updateMutation = useMutation({
    ...trpc.kpiMerit.updateCompetency.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.kpiMerit.getOne.queryOptions({ year }));
      isUpdatingRef.current = false;
    },
    onError: (error) => {
      console.error('Update failed:', error);
      
      // Reset to original value on error
      const currentDataString = String(data ?? "");
      setValue(currentDataString);

      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to update. Please try again.";

      toast.error(errorMessage);
      isUpdatingRef.current = false;
    },
  });

  const displayValue = useMemo(() => value, [value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  const processFieldValue = useCallback((fieldName: keyof CompetencyItem, rawValue: string): KpiFieldValue => {
    try {
      const processor = FIELD_PROCESSORS[fieldName as keyof typeof FIELD_PROCESSORS];

      if (!processor) {
        return rawValue.trim() || null;
      }

      return processor(rawValue);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid input";
      toast.error(message);
      throw error;
    }
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    // Prevent updates during an ongoing update
    if (isUpdatingRef.current) return;

    const currentDataString = String(data ?? "");
    
    // Don't proceed if opening or if value hasn't changed
    if (open || value === currentDataString) return;

    // Don't update if the ID is empty (new/unsaved record)
    if (!id) {
      setValue(currentDataString);
      return;
    }

    try {
      isUpdatingRef.current = true;
      const processedValue = processFieldValue(fieldName, value);

      const updatePayload = {
        id,
        [fieldName]: processedValue,
      };

      updateMutation.mutate(updatePayload);
    } catch (error) {
      console.error('Field processing failed:', error);
      setValue(currentDataString);
      isUpdatingRef.current = false;
    }
  }, [
    value, 
    data, 
    processFieldValue, 
    fieldName, 
    id, 
    updateMutation
  ]);

  return (
    <RowInput
      variant={variant}
      value={value}
      onChange={handleInputChange}
      onOpenChange={handleOpenChange}
      width={width}
      height={childrenHeight}
    >
      <div
        role="button"
        ref={childrenRef}
        className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2"
      >
        {children(displayValue)}
      </div>
    </RowInput>
  );
};