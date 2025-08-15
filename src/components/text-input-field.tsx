"use client";

import { FieldValues } from "react-hook-form";

import { TextInputProps } from "@/types/inputs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

export const TextInputField = <T extends FieldValues,>({ name, watch, register }: TextInputProps<T>) => {
  const displayValue = watch(name) 
    ? watch(name) : "Empty";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="transition hover:bg-primary/6 relative text-sm overflow-hidden inline-block rounded w-full py-1.5 px-2.5">
          <div className="leading-5 break-all whitespace-pre-wrap text-foreground text-start">
            {displayValue}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[248px] p-0" sideOffset={-32}>
        <div className="p-2 min-h-[38px] flex flex-col justify-between grow text-sm">
          <textarea
            {...register(name)}
            className="break-all whitespace-break-spaces max-w-[232px] w-[232px] min-w-[232px] resize-none focus-visible:outline-none field-sizing-content min-h-0 text-primary"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}