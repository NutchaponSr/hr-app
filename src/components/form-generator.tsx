import { 
  ControllerRenderProps, 
  FieldPath,
  FieldValues, 
  UseFormReturn 
} from "react-hook-form";
import { useMemo, useState, type ReactElement } from "react";

import { cn } from "@/lib/utils";

import { InputVariants } from "@/types/inputs";

import { 
  FormControl,
  FormField, 
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Hint } from "@/components/hint";
import { SelectionBadge } from "@/components/selection-badge";

interface Props<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label?: string;
  form: UseFormReturn<TFieldValues>;
  variant: InputVariants;
  placeholder?: string;
  className?: {
    form?: string;
    input?: string;
  };
  disabled: boolean;
  selectOptions?: Array<{ key: string; label: string }>;
}

interface RenderProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
  placeholder?: string;
  className?: string;
  disabled: boolean;
  selectOptions?: Array<{ 
    key: string;
    label: string; 
  }>;
}

type InputRenderer<TFieldValues extends FieldValues> = (props: RenderProps<TFieldValues>) => ReactElement;

export const FormGenerator = <TFieldValues extends FieldValues>({ 
  name, 
  form, 
  label,
  variant,
  disabled,
  placeholder,
  className,
  selectOptions,
}: Props<TFieldValues>) => {
  const INPUT_RENDERERS: Partial<Record<InputVariants, InputRenderer<TFieldValues>>> = {
    text: Text,
    numeric: Numeric,
    select: Select,
    string: String,
  } as const;

  const render = INPUT_RENDERERS[variant] ?? Text;
  
  return (
    <FormField  
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className?.form}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            {render({
              field,
              disabled,
              placeholder,
              selectOptions,
              className: className?.input,
            })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const String = <TFieldValues extends FieldValues>({ 
  field, 
  disabled,
  className,
  placeholder = "Empty",
}: RenderProps<TFieldValues>) => (
  <Input 
    {...field}
    value={field.value ?? ""}
    placeholder={placeholder}
    className={cn("h-7 px-2", className)}
    disabled={disabled}
  />
);

const Numeric = <TFieldValues extends FieldValues>({ 
  field, 
  className,
  disabled,
  placeholder = "Empty",
}: RenderProps<TFieldValues>) => (
  <Input 
    {...field}
    value={field.value ?? ""}
    type="number"
    disabled={disabled}
    placeholder={placeholder}
    className={cn("h-7 px-2", className)}
  />
);

 const Text = <TFieldValues extends FieldValues>({ 
  field, 
  className,
  disabled,
  placeholder = "Empty",
 }: RenderProps<TFieldValues>) => (
  <Textarea 
    {...field}
    value={field.value ?? ""}
    placeholder={placeholder}
    className={cn(className)}
    disabled={disabled}
  />
);

const Select = <TFieldValues extends FieldValues>({
  field,
  disabled,
  selectOptions
}: RenderProps<TFieldValues>) => {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
  return selectOptions?.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );
  }, [selectOptions, search]);

  const selectedOption = selectOptions?.find(opt => opt.key === field.value)?.label || field.value;

  return (
    <Popover>
      <Hint 
        align="center" 
        label={selectedOption}
      >
        <PopoverTrigger asChild>
          <div
            role="button"
            data-disabled={disabled}
            className="select-none transition relative text-sm overflow-hidden rounded w-full h-7 p-1 flex items-center hover:bg-primary/6 data-[disabled=true]:-z-1"
          >
            <SelectionBadge 
              className="max-w-[120px]"
              label={selectedOption} 
            />
          </div>
        </PopoverTrigger>
      </Hint>
      <PopoverContent
        className="p-0 w-60"
        align="start"
      >
        <div className="flex flex-col min-w-[180px] max-w-[calc(-24px+100vw)] h-full max-h-[70vh]">
          <div className="shrink-0 max-h-60 shadow-[inset_0_-1.25px_rgba(55,53,47,0.16)] overflow-y-auto overflow-x-hidden">
            <div className="flex whitespace-nowrap items-start bg-[#f2f1ee99] dark:bg-white/3 overflow-auto text-sm min-h-7 p-1 rounded-t">
              <div className="flex flex-wrap grow py-1 px-2 gap-1.5">
                {field.value ? (
                  <SelectionBadge 
                    label={(selectOptions?.find(o => o.key === field.value)?.label) ?? field.value} 
                    onClick={() => field.onChange?.("")} 
                  />
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
          {filteredOptions ? (
            <div role="listbox" className="relative gap-px flex flex-col p-1">
              <div className="flex px-2 my-1.5 text-tertiary font-medium select-none text-xs">
                <h4 className="self-center whitespace-nowrap overflow-hidden text-ellipsis">
                  Select an option
                </h4>
              </div>
              <div className="m-0">
                {filteredOptions?.map(({ key, label }) => (
                  <div 
                    key={key}
                    role="option"
                    aria-selected={field.value === key}
                    onClick={() => field.onChange?.(key)}
                    className="flex transition w-full hover:bg-primary/6 rounded cursor-pointer"
                  > 
                    <div className="flex items-center gap-2 px-2 text-sm min-h-7 w-full">
                      <div className="flex-1">
                        <div className="inline-flex items-center shrink max-w-full min-w-0 h-5 rounded-xs px-1.5 leading-[120%] text-sm bg-gray-foreground text-gray-muted dark:text-gray-neutral whitespace-nowrap overflow-hidden text-ellipsis">
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
      </PopoverContent>
    </Popover>
  );
}