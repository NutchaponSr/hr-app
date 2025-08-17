import { FieldValues, Path, UseFormRegister } from "react-hook-form";

import { InputVariants, SelectInputProps } from "@/types/inputs";
import { JSX, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { SelectionBadge } from "./selection-badge";

interface Props<T extends FieldValues> {
  variant: InputVariants;
  className?: string;
  children: React.ReactNode;
  name: Path<T>;
  register: UseFormRegister<T>;
  value: string;
  options?: { key: string; label: string; onSelect: (value: string) => void }[];
  onClear?: () => void;
}

export const FieldInput = <T extends FieldValues>({
  className,
  children,
  variant,
  ...props
}: Props<T>) => {
  const FieldComponent: Record<InputVariants, JSX.Element> = {
    numeric: <FieldInput.Numeric {...props} />,
    text: <FieldInput.Text {...props} />,
    select: <FieldInput.Select {...props as SelectInputProps<T>} />,
  } 

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className={cn(className, "w-[248px] p-0")} sideOffset={-32}>
        {FieldComponent[variant]}
      </PopoverContent>
    </Popover>
  );
}

FieldInput.Numeric = function NumericInput<T extends FieldValues>({
  name,
  value,
  register,
}: {
  value: string;
  name: Path<T>;
  register: UseFormRegister<T>;
}) {
  return (
    <input
      type="number"
      value={String(value)}
      className="w-full focus-visible:outline-none h-8 px-2 text-sm text-primary"
      {...register(name)}
    />
  );
}

FieldInput.Text = function TextInput<T extends FieldValues>({
  name,
  register,
}: {
  name: Path<T>
  register: UseFormRegister<T>;
}) {
  return (
    <div className="p-2 min-h-[38px] flex flex-col justify-between grow text-sm">
      <textarea
        {...register(name)}
        className="break-all whitespace-break-spaces max-w-[232px] w-[232px] min-w-[232px] resize-none focus-visible:outline-none field-sizing-content min-h-0 text-primary"
      />
    </div>
  );
}

FieldInput.Select = function SelectInput<T extends FieldValues>({
  value,
  options,
  onClear,
}: {
  name: Path<T>;
  value: string;
  options: {
    key: string;
    label: string;
    onSelect: (value: string) => void;
  }[];
  onClear: () => void;
}) {
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
              {filteredOptions.map(({ key, label, onSelect }) => (
                <div 
                  key={key}
                  role="option"
                  aria-selected={value === label}
                  onClick={() => onSelect(key)}
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