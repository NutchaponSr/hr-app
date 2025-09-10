import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";

import { inputIcons, InputVariants } from "@/types/inputs";

import { FormControl, FormField, FormItem } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { InputGenerator } from "./input-generator";
import { InputDisplay } from "./input-display";
import { Hint } from "./hint";

interface Props<T extends FieldValues> {
  label: string;
  name: Path<T>;
  form: UseFormReturn<T>;
  variant: InputVariants;
  value?: string;
  options?: Array<{ key: string; label: string; }>;
}

export const RowField = <T extends FieldValues>({
  form,
  label,
  name,
  variant,
  ...props
}: Props<T>) => {
  const Icon = inputIcons[variant];

  const triggerRef = useRef<HTMLDivElement>(null);

  const [sideOffset, setSideOffset] = useState(0);

  const fieldValue = form.watch(name);

  const updateOffset = useCallback(() => {
    if (triggerRef.current) {
      const triggerHeight = triggerRef.current.offsetHeight;
      setSideOffset(-triggerHeight);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateOffset();
    }, 0);

    return () => clearTimeout(timer);
  }, [fieldValue, updateOffset]);

  return (
    <div role="row" className="flex w-full relative mb-1">
      <div className="flex flex-row items-center self-start">
        <div className="flex items-center text-tertiary h-8 w-40 max-w-60 min-w-0">
          <Hint label={label} side="left">
            <div role="cell" className="select-none transition flex items-center h-full w-full rounded hover:bg-primary/6 max-w-full px-1.5">
              <div className="flex items-center leading-5 text-sm min-w-0">
                <Icon className="size-4 mr-1.5 shrink-0" />
                <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {label}
                </div>
              </div>
            </div>
          </Hint>
        </div>
      </div>

      <div role="cell" className="flex h-full grow shrink basis-auto min-w-0 ms-1">
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <Popover modal>
              <PopoverTrigger asChild>
                <div
                  ref={triggerRef}
                  role="button"
                  className="select-none transition relative text-sm overflow-hidden rounded w-full min-h-8 px-2 py-1 flex items-center hover:bg-primary/6"
                >
                  <div data-value={!!field.value} className="leading-5 break-all whitespace-pre-wrap text-tertiary data-[value=true]:text-primary">
                    <InputDisplay
                      variant={variant}
                      value={field.value}
                      options={props.options}
                    />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-[var(--radix-popover-trigger-width)]"
                align="start"
                side="bottom"
                sideOffset={sideOffset}
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                  updateOffset();
                }}
              >
                <FormItem>
                  <FormControl>
                    <InputGenerator
                      variant={variant}
                      value={field.value}
                      onChange={field.onChange}
                      {...props}
                    />
                  </FormControl>
                </FormItem>
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
    </div>
  );
}