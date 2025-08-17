import { 
  FieldErrors,
  FieldValues, 
  Path, 
  UseFormRegister, 
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { inputIcons, InputVariants } from "@/types/inputs";

import { FieldInput } from "@/components/field-input";
import { InputDisplay } from "@/components/input-display";

interface Props<T extends FieldValues> {
  name: Path<T>;
  label: string;
  value: string;
  options?: { key: string; label: string; onSelect: (value: string) => void }[];
  variant: InputVariants;
  errors: FieldErrors<FieldValues>;
  register: UseFormRegister<T>;
  onClear?: () => void;
}

export const FormFieldRow = <T extends FieldValues,>({ 
  label,
  variant,
  errors,
  ...props
}: Props<T>) => {
  const Icon = inputIcons[variant];

  return (
    <>
      <div
        role="row"
        className="flex w-full relative mb-1"
      >
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
                <InputDisplay  variant={variant} {...props} />
              </div>
            </button>
          </FieldInput>
        </div>
      </div>
      <ErrorMessage 
        errors={errors}
        name={props.name}
        render={({ message }) => (
          <p className="text-destructive text-xs">
            {message}
          </p>
        )}
      />
    </>
  );
}