import { IconType } from "react-icons";
import { FiLoader } from "react-icons/fi";
import { HiHashtag } from "react-icons/hi2";
import { BsTextLeft } from "react-icons/bs";
import { FieldValues, Path, UseFormRegister, UseFormWatch } from "react-hook-form";

export const inputVariants = ["numeric", "text", "select"] as const;
export type InputVariants = typeof inputVariants[number];

export const inputIcons: Record<InputVariants, IconType> = {
  numeric: HiHashtag,
  text: BsTextLeft,
  select: FiLoader,
};

export interface BaseInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  watch: UseFormWatch<T>;
  register: UseFormRegister<T>;
}

export interface TextInputProps<T extends FieldValues> extends BaseInputFieldProps<T> {
  variant: "text";
  value?: never;
  options?: never;
  onClear?: never;
}

export interface NumericInputProps<T extends FieldValues> extends BaseInputFieldProps<T> {
  variant: "numeric";
  value?: never;
  options?: never; 
  onClear?: never; 
}

export interface SelectInputProps<T extends FieldValues> extends BaseInputFieldProps<T> {
  variant: "select";
  value: string; 
  options: { key: string; label: string; onSelect: (value: string) => void }[]; 
  onClear: () => void; 
}

export type InputFieldProps<T extends FieldValues> =
  | TextInputProps<T>
  | NumericInputProps<T>
  | SelectInputProps<T>;
