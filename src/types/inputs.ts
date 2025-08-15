import { 
  AlignLeftIcon,
  HashIcon, 
  LoaderIcon, 
  LucideIcon 
} from "lucide-react";
import { FieldValues, Path, UseFormRegister, UseFormWatch } from "react-hook-form";

export const inputVariants = ["numeric", "text", "select"] as const;

export type InputVariants = typeof inputVariants[number];

export const inputIcons: Record<InputVariants, LucideIcon> = {
  numeric: HashIcon,
  text: AlignLeftIcon,
  select: LoaderIcon,
}

export interface BaseInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  watch: UseFormWatch<T>;
  register: UseFormRegister<T>;
}

export interface TextInputProps<T extends FieldValues> extends BaseInputFieldProps<T> {
  variant: "text";
}

export interface NumericInputProps<T extends FieldValues> extends BaseInputFieldProps<T> {
  variant: "numeric";
}

export interface SelectInputProps<T extends FieldValues> extends BaseInputFieldProps<T> {
  variant: "select";
  value: string;
  options: {
    key: string;
    label: string;
    onSelect: (value: string) => void;
  }[];
  onClear: () => void;
}

export type InputProviderProps<T extends FieldValues> =
  | TextInputProps<T>
  | NumericInputProps<T>
  | SelectInputProps<T>;