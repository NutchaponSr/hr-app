import { useMemo, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/utils";

import { InputVariants, SelectInput } from "@/types/inputs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { SelectionBadge } from "@/components/selection-badge";

interface Props {
  variant: Exclude<InputVariants, "action">;
  className?: string;
  children: React.ReactNode;
  value: string;
  width?: string;
  height?: number;
  register: UseFormRegisterReturn<string>;
  options?: Array<{ key: string; label: string; }>;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const FieldInput = ({
  width,
  height,
  className,
  children,
  variant,
  onOpenChange,
  ...props
}: Props) => {
  const FieldComponent: Record<Exclude<InputVariants, "action">, React.ReactElement> = {
    numeric: <FieldInput.Numeric {...props} />,
    text: <FieldInput.Text {...props} />,
    main: <FieldInput.Text {...props} />,
    select: <FieldInput.Select {...props as SelectInput} />,
  } 

  return (
    <Popover modal onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        side="bottom"
        style={{ width }}
        className={cn(className, "w-[248px] p-0")} 
        sideOffset={height ? (height * -1) + 0.5 : 0}
      >
        {variant in FieldComponent ? FieldComponent[variant as keyof typeof FieldComponent] : null}
      </PopoverContent>
    </Popover>
  );
}

FieldInput.Numeric = function NumericInput({ register }: { register: UseFormRegisterReturn<string> }) {
  return (
    <input
      type="number"
      className="w-full focus-visible:outline-none h-8 px-2 text-sm text-primary"
      {...register}
    />
  );
}

FieldInput.Text = function TextInput({ register }: { register: UseFormRegisterReturn<string> }) {
  return (
    <div className="p-2 min-h-[38px] flex flex-col justify-between grow text-sm">
      <textarea
        {...register}
        rows={1}
        className="break-all whitespace-break-spaces resize-none focus-visible:outline-none field-sizing-content min-h-0 text-primary"
      />
    </div>
  );
}

FieldInput.Select = function SelectInput({
  value,
  options,
  onChange,
  onClear
}: SelectInput) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <>
      <div className="flex flex-col min-w-[180px] max-w-[calc(-24px+100vw)] h-full max-h-[70vh]">
        <div className="shrink-0 max-h-60 shadow-[inset_0_-1.25px_rgba(55,53,47,0.16)] overflow-y-auto overflow-x-hidden">
          <div className="flex whitespace-nowrap items-start bg-[#f2f1ee99] overflow-auto text-sm min-h-7 p-1">
            <div className="flex flex-wrap grow py-1 px-2 gap-1.5">
              {value ? (
                <SelectionBadge label={value} onClick={onClear} />
              ) : (
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for an option..."
                  className="w-full focus-visible:outline-none h-5 text-primary placeholder:text-muted"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grow overflow-y-auto overflow-x-hidden">
        {filteredOptions.length > 0 ? (
          <div role="listbox" className="relative gap-px flex flex-col p-1">
            <div className="flex px-2 my-1.5 text-tertiary font-medium select-none text-xs">
              <h4 className="self-center whitespace-nowrap overflow-hidden text-ellipsis">
                Select an option
              </h4>
            </div>
            <div className="m-0">
              {filteredOptions.map(({ key, label }) => (
                <div 
                  key={key}
                  role="option"
                  aria-selected={value === label}
                  onClick={() => onChange(label)}
                  className="flex transition w-full hover:bg-primary/6 rounded cursor-pointer"
                > 
                  <div className="flex items-center gap-2 px-2 text-sm min-h-7 w-full">
                    <div className="flex-1">
                      <div className="inline-flex items-center shrink max-w-full min-w-0 h-5 rounded-xs px-1.5 leading-[120%] text-sm bg-gray-foreground text-gray-muted whitespace-nowrap overflow-hidden text-ellipsis">
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis inline-flex items-center h-5 leading-5">
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative p-1 flex flex-col">
            <div className="flex items-center gap-2 leading-[120%] w-full select-none py-1 px-2 mt-0.5 mb-1.5">
              <div className="whitespace-nowrap overflow-hidden text-ellipsis text-tertiary text-xs">
                No Result
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}