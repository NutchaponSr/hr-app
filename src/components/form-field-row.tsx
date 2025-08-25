import { 
  FieldErrors,
  FieldValues, 
  UseFormRegisterReturn,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { inputIcons, InputVariants } from "@/types/inputs";

import { FieldInput } from "@/components/field-input";
import { InputDisplay } from "@/components/input-display";

interface Props {
  label: string;
  value: string;
  name: string;
  options?: Array<{ key: string; label: string; }>;
  variant: Exclude<InputVariants, "main" | "action">;
  errors: FieldErrors<FieldValues>;
  register: UseFormRegisterReturn<string>;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

export const FormFieldRow = ({ 
  label,
  variant,
  errors,
  name,
  ...props
}: Props) => {
  const Icon = inputIcons[variant];

  return (
    <>
      <div role="row" className="flex w-full relative mb-1">
        <div role="cell" className="flex items-center h-8 rounded max-w-40 w-40 px-1.5">
          <Icon className="size-4 mr-1.5 text-tertiary" />
          <div className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-tertiary">
            {label}
          </div>
        </div>
        <div role="cell" className="flex h-full flex-1 flex-col ms-1">
          <FieldInput variant={variant} {...props}>
            <button className="transition hover:bg-primary/6 relative text-sm overflow-hidden inline-block rounded w-full py-1.5 px-2.5">
              <div className="leading-5 break-all whitespace-pre-wrap text-foreground text-start">
                <InputDisplay 
                  variant={variant} 
                  value={props.value} 
                />
              </div>
            </button>
          </FieldInput>
        </div>
      </div>
      <ErrorMessage 
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="text-destructive text-xs">
            {message}
          </p>
        )}
      />
    </>
  );
}