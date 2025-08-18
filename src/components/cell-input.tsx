import { useMemo, useState, useCallback } from "react";
import { InputVariants } from "@/types/inputs";
import { SelectionBadge } from "./selection-badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

interface SelectOption {
  key: string;
  label: string;
  onSelect?: (value: string) => void;
}

interface RowInputProps {
  variant: InputVariants;
  value: string;
  className?: string;
  width?: string;
  children: React.ReactNode;
  options?: SelectOption[];
  onClear?: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelect?: (value: string) => void;
  onOpenChange: (open: boolean) => void;
}

interface InputComponentProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

interface SelectInputProps {
  value: string;
  options?: SelectOption[];
  onClear?: () => void;
  onSelect?: (value: string) => void;
}

const NumericInput = ({ value, onChange }: InputComponentProps) => (
  <input
    type="number"
    value={value}
    onChange={onChange}
    className="w-full focus-visible:outline-none h-[37px] px-2 text-sm text-primary"
  />
);

const TextInput = ({ value, onChange }: InputComponentProps) => (
  <div className="p-2 min-h-[38px] flex flex-col justify-between grow text-sm">
    <textarea
      value={value}
      onChange={onChange}
      className="break-all whitespace-break-spaces w-full resize-none focus-visible:outline-none field-sizing-content min-h-0 text-primary"
    />
  </div>
);

const SelectInput = ({ value, options = [], onClear, onSelect }: SelectInputProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => 
    options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    ), [options, searchQuery]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleOptionSelect = useCallback((option: SelectOption) => {
    if (option.onSelect) {
      option.onSelect(option.key);
    } else if (onSelect) {
      onSelect(option.key);
    }
  }, [onSelect]);

  const selectedOption = useMemo(() => 
    options.find(opt => opt.key === value), [options, value]
  );

  return (
    <>
      <div className="flex flex-col min-w-[180px] max-w-[calc(-24px+100vw)] h-full max-h-[70vh]">
        <div className="shrink-0 max-h-60 shadow-[inset_0_-1.25px_rgba(55,53,47,0.16)] overflow-y-auto overflow-x-hidden">
          <div className="flex whitespace-nowrap items-start bg-[#f2f1ee99] overflow-auto text-sm min-h-7 p-1">
            <div className="flex flex-wrap grow py-1 px-2 gap-1.5">
              {value ? (
                <SelectionBadge
                  label={selectedOption?.label || value}
                  onClick={onClear}
                />
              ) : (
                <input
                  value={searchQuery}
                  onChange={handleSearchChange}
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
              {filteredOptions.map((option) => (
                <div
                  key={option.key}
                  role="option"
                  aria-selected={value === option.label}
                  onClick={() => handleOptionSelect(option)}
                  className="flex transition w-full hover:bg-primary/6 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-2 px-2 text-sm min-h-7 w-full">
                    <div className="flex-1">
                      <div className="inline-flex items-center shrink max-w-full min-w-0 h-5 rounded-xs px-1.5 leading-[120%] text-sm bg-gray-foreground text-gray-muted whitespace-nowrap overflow-hidden text-ellipsis">
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis inline-flex items-center h-5 leading-5">
                          {option.label}
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
};

const INPUT_COMPONENTS = {
  main: TextInput,
  numeric: NumericInput,
  text: TextInput,
  select: SelectInput,
} as const;

export const RowInput = ({
  className,
  children,
  variant,
  width,
  onOpenChange,
  ...inputProps
}: RowInputProps) => {
  const InputComponent = INPUT_COMPONENTS[variant as keyof typeof INPUT_COMPONENTS];

  if (!InputComponent) {
    return null;
  }

  return (
    <Popover modal onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={{ width }}
        className={cn(className, "w-[248px] p-0")}
        sideOffset={-37}
      >
        <InputComponent {...inputProps} />
      </PopoverContent>
    </Popover>
  );
};