"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { NumericInputProps } from "@/types/inputs";
import { FieldValues, } from "react-hook-form";

export const NumericInputField = <T extends FieldValues,>({ name, watch, register }: NumericInputProps<T>) => {
  const displayValue = watch(name) 
    ? `${Number(watch(name)).toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })} %` : "Empty";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="transition hover:bg-primary/6 relative text-sm overflow-hidden inline-block rounded w-full h-8 py-1.5 px-2.5">
          <div className="leading-5 break-words whitespace-pre-wrap text-foreground text-start">
            {displayValue}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[248px] p-0" sideOffset={-32}>
        <input
          type="number"
          value={watch(name)?.toString() ?? ""}
          className="w-full focus-visible:outline-none h-8 px-2 text-sm text-primary"
          {...register(name)}
        />
      </PopoverContent>
    </Popover>
  );
}