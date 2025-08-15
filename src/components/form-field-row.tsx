import { 
  FieldErrors,
  FieldValues, 
  Path, 
  UseFormRegister, 
  UseFormWatch 
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { InputProvider } from "@/providers/input-provider";

import { inputIcons, InputVariants } from "@/types/inputs";


interface Props<T extends FieldValues> {
  name: Path<T>;
  label: string;
  value?: string;
  options?: {
    key: string;
    label: string;
    onSelect: (value: string) => void;
  }[];
  variant: InputVariants;
  errors: FieldErrors<FieldValues>;
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  onClear?: () => void;
}

export const FormFieldRow = <T extends FieldValues,>({ 
  label,
  variant,
  errors,
  ...props
}: Props<T>) => {
  const Icon = inputIcons[variant];

  const getInputProviderProps = () => {
    const baseProps = {
      name: props.name,
      register: props.register,
      watch: props.watch,
    };

    switch (variant) {
      case "select":
        return {
          ...baseProps,
          variant: "select" as const,
          value: props.value || "",
          options: props.options || [],
          onClear: props.onClear || (() => {}),
        };
      case "numeric":
        return {
          ...baseProps,
          variant: "numeric" as const,
        };
      case "text":
        return {
          ...baseProps,
          variant: "text" as const,
        };
    }
  };

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
          <InputProvider {...getInputProviderProps()}/>
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