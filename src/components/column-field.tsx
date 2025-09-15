import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { inputIcons, InputVariants } from "@/types/inputs";

import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage
} from "@/components/ui/form";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";

import { InputDisplay } from "@/components/input-display";
import { InputGenerator } from "@/components/input-generator";

interface Props<T extends FieldValues> {
  label: string;
  name: Path<T>;
  form: UseFormReturn<T>;
  variant: InputVariants;
  options?: Array<{ key: string; label: string; }>;
}

export const ColumnField = <T extends FieldValues>({
  form,
  name,
  label,
  variant,
  options
}: Props<T>) => {
  const Icon = inputIcons[variant];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div className="flex flex-row">
            <div className="flex items-center text-tertiary h-6 w-min max-w-full min-w-0">
              <div role="cell" className="select-none transition flex items-center h-full w-full rounded px-1.5 max-w-full hover:bg-primary/6">
                <div className="flex items-center leading-4.5 min-w-0 text-xs font-medium">
                  <Icon className="size-3 me-1.5" />
                  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {label}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Popover modal>
            <PopoverTrigger asChild>
              <button type="button" className="select-none transition relative text-sm overflow-hidden rounded w-full min-h-7.5 px-2 py-1 flex items-center hover:bg-primary/6">
                <InputDisplay 
                  variant={variant} 
                  value={field.value}
                  options={options}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <FormControl>
                <InputGenerator
                  options={options}
                  variant={variant}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}