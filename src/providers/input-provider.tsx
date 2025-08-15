import { FieldValues } from "react-hook-form";

import { InputProviderProps, SelectInputProps, TextInputProps } from "@/types/inputs";

import { TextInputField } from "@/components/text-input-field";
import { SelectInputField } from "@/components/select-input-field";
import { NumericInputField } from "@/components/numeric-input-field";


export const InputProvider = <T extends FieldValues,>({ variant, ...props }: InputProviderProps<T>) => {
  switch (variant) {
    case "numeric":
      return (
        <NumericInputField variant="numeric" {...props} />
      );
    case "select": 
      return (
        <SelectInputField {...(props as SelectInputProps<T>)}/>
      );
    case "text":
      return (
        <TextInputField  {...(props as TextInputProps<T>)} />
      )
  }
}